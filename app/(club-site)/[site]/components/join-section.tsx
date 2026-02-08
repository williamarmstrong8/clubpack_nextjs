import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function JoinSection() {
  return (
    <section id="join" className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/12 via-primary/6 to-background" />
            <CardContent className="relative p-8 md:p-10">
              <div className="max-w-2xl space-y-3">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Join the next run
                </h3>
                <p className="text-sm text-muted-foreground">
                  RSVP isn&apos;t required — but it helps us plan. You can always
                  show up and meet the group.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button size="lg">Join club</Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="./events">Browse events</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}

