import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function CreateMemberPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Admin</Badge>
            <Badge variant="outline">UI only</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Create member</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            This is a UI-only form to preview the member creation flow. We’ll
            connect it to Supabase later.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="../">Back</Link>
          </Button>
          <Button>Create member</Button>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Member details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="Alex" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Johnson" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="alex@domain.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="(555) 555-5555" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Emergency contact</Label>
                <Input id="emergencyName" placeholder="Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency phone</Label>
                <Input id="emergencyPhone" type="tel" placeholder="(555) 555-5555" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Anything we should know? (injuries, goals, preferred pace group, etc.)"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Membership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input id="status" defaultValue="Active" />
              <p className="text-xs text-muted-foreground">
                Later this will be a dropdown with rules.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Input id="plan" defaultValue="Free" />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium">Waiver</div>
              <div className="rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">
                Waiver signing flow will be added later. For now, this page is
                for layout and UX only.
              </div>
            </div>

            <Button className="w-full" size="lg">
              Create member
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

