import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ClubSignupPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Join this club in under a minute (UI-only for now).
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="William" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Armstrong" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@domain.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
              <p className="text-xs text-muted-foreground">
                Use 8+ characters. (We’ll enforce rules later.)
              </p>
            </div>

            <Button className="w-full" size="lg">
              Create account
            </Button>

            <Separator />

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="../login" className="text-foreground underline">
                Log in
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground">
              <Link href="../" className="hover:text-foreground">
                Back to club site
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

