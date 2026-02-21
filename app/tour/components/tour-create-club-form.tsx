"use client";

/**
 * Tour create-club form: read-only when showing instruction; interactive when
 * signup phase is active (user types and clicks Create club to continue the tour).
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { tourCreateClubForm } from "../mock-data";

const SUFFIX = ".joinclubpack.com";

export function TourCreateClubForm({
  clubName: clubNameProp,
  subdomain: subdomainProp,
  interactive = false,
  onClubNameChange,
  onContinue,
}: {
  clubName?: string;
  subdomain?: string;
  interactive?: boolean;
  onClubNameChange?: (value: string) => void;
  onContinue?: () => void;
} = {}) {
  // Allow empty string so user can select-all and delete; only fall back to mock when undefined
  const clubName = clubNameProp !== undefined && clubNameProp !== null ? clubNameProp : tourCreateClubForm.clubName;
  const subdomain = subdomainProp !== undefined && subdomainProp !== null ? subdomainProp : tourCreateClubForm.subdomain;
  const canContinue = interactive && !!clubName.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create your club</CardTitle>
        <CardDescription>
          Give your club a name and choose a URL for your site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (canContinue && onContinue) onContinue();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="tour-clubName">Club name</Label>
            <Input
              id="tour-clubName"
              value={clubName}
              placeholder="e.g. Outdoor Adventure Club"
              readOnly={!interactive}
              disabled={!interactive}
              onChange={interactive && onClubNameChange ? (e) => onClubNameChange(e.target.value) : undefined}
              className={interactive ? "bg-background" : "bg-muted/50"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tour-subdomain">Site URL</Label>
            <div className="flex items-center gap-0">
              <Input
                id="tour-subdomain"
                value={subdomain}
                readOnly
                disabled
                className="rounded-r-none border-r-0 bg-muted/50"
              />
              <span className="flex h-9 items-center rounded-r-md border border-input bg-muted px-3 text-sm text-muted-foreground whitespace-nowrap">
                {SUFFIX}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              This will be your club&apos;s website address.
            </p>
          </div>
          {interactive ? (
            <Button type="submit" disabled={!canContinue}>Create club</Button>
          ) : (
            <Button type="button" disabled className="pointer-events-none">
              Create club
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
