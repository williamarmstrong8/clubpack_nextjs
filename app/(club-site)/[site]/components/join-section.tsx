import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function JoinSection() {
  return (
    <section id="join" className="bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-2">
          <CardContent className="p-8 md:p-10">
            <div className="max-w-3xl space-y-3">
              <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Join the club
              </h3>
              <p className="text-base text-muted-foreground sm:text-lg">
                RSVP isn&apos;t required — but it helps us plan. You can always
                show up and meet the group.
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="sm:px-8 bg-primary hover:bg-primary/90">
                  <Link href="./signup">Join club</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="sm:px-8">
                  <Link href="./events">Browse events</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

