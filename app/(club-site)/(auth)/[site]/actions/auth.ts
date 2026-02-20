"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getClubBySubdomain } from "@/lib/data/club-site";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  const site = (formData.get("site") as string)?.trim();
  if (site && authData.user) {
    const club = await getClubBySubdomain(site);
    if (club?.id) {
      const { data: membership } = await supabase
        .from("memberships")
        .select("id")
        .eq("club_id", club.id)
        .eq("auth_user_id", authData.user.id)
        .maybeSingle();

      if (!membership) {
        await supabase.auth.signOut();
        revalidatePath("/", "layout");
        return {
          error: "You don't have a membership for this club. Sign up to join first.",
        };
      }
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/** Ensure a membership exists for this user and club; create one if not. Returns error message or null. */
async function ensureMembershipForClub(
  supabase: Awaited<ReturnType<typeof createClient>>,
  clubId: string,
  authUserId: string,
  email: string | null,
  name: string | null,
): Promise<string | null> {
  const { data: existing } = await supabase
    .from("memberships")
    .select("id")
    .eq("club_id", clubId)
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (existing?.id) return null;

  const { error } = await supabase.from("memberships").insert({
    club_id: clubId,
    auth_user_id: authUserId,
    email,
    name: name?.trim() || null,
  });
  return error?.message ?? null;
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";
  const firstName = (formData.get("firstName") as string)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string)?.trim() ?? "";
  const site = (formData.get("site") as string)?.trim() ?? "";

  const data = {
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  };

  const { error, data: authData } = await supabase.auth.signUp(data);

  const isExistingUser =
    (error && /already|registered/.test(error.message?.toLowerCase() ?? "")) ||
    (!error && !!authData?.user && (!authData.user.identities || authData.user.identities.length === 0));

  if (isExistingUser) {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      return {
        error:
          "This email is already registered. Log in with your password to join this club, or use a different email.",
      };
    }
    const user = signInData?.user;
    if (!user || !site) {
      revalidatePath("/", "layout");
      return { success: true };
    }
    const club = await getClubBySubdomain(site);
    if (!club?.id) {
      revalidatePath("/", "layout");
      return { success: true };
    }
    const name = [firstName, lastName].filter(Boolean).join(" ") || null;
    const memError = await ensureMembershipForClub(
      supabase,
      club.id,
      user.id,
      user.email ?? email,
      name,
    );
    if (memError) return { error: memError };
    revalidatePath("/", "layout");
    return { success: true };
  }

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, userId: authData?.user?.id };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
