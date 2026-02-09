import { redirect } from "next/navigation";
import { getUser } from "../actions/auth";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const user = await getUser();

  if (!user) {
    redirect(`/${site}/login`);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/20 px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to the club!</h1>
          <p className="text-muted-foreground">
            Let's complete your member profile so you can join events and connect with the community.
          </p>
        </div>
        <OnboardingForm site={site} user={user} />
      </div>
    </div>
  );
}
