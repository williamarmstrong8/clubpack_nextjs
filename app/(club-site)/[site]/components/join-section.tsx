import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function JoinSection() {
  return (
    <section id="join" className="bg-white py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden rounded-none border border-gray-200">
          <CardContent className="px-6 py-5 sm:px-8 sm:py-6">
            <div className="max-w-3xl space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Join the club
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 sm:text-xl">
                We ask that you RSVP for events so we can plan. Join to reserve
                your spot and stay in the loop.
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="rounded-none bg-primary hover:bg-primary/90 sm:px-8">
                  <Link href="./signup">Join club</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none sm:px-8">
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

