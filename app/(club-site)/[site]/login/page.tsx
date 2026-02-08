import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClubLoginPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Log in</CardTitle>
            <p className="text-sm text-muted-foreground">
              UI-only for now. Authentication will be connected later.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@domain.com" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <Button className="w-full" size="lg">
              Log in
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link href="../signup" className="text-foreground underline">
                Create an account
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

