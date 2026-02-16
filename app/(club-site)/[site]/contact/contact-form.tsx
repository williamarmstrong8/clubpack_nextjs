"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "./actions";

export function ContactForm({ site, clubName }: { site: string; clubName: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await submitContactForm(site, {
      first_name: String(formData.get("firstName") ?? "").trim(),
      last_name: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    });

    setLoading(false);
    if (result.ok) {
      setSuccess(true);
      form.reset();
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="border border-gray-200 bg-white p-6 lg:p-8">
      <h2 className="mb-6 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
        Send us a message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              Message sent! We'll get back to you soon.
            </div>
          )}
          
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="e.g. Question about membership, event, or general inquiry"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Type your message here..."
              rows={6}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="h-auto w-full rounded-none px-8 py-2.5 text-sm font-medium" size="lg" disabled={loading}>
            {loading ? "Sending..." : "Send message"}
          </Button>
        </form>
    </div>
  );
}
