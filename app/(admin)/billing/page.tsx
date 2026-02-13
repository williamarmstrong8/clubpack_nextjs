"use client"

import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "Free",
    period: "month",
    features: [
      "Up to 50 members",
      "Club website",
      "Admin dashboard",
      "Basic event management",
      "Email support",
    ],
    cta: "Current plan",
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 4.99,
    priceLabel: "$4.99",
    period: "month",
    features: [
      "Up to 500 members",
      "Everything in Free",
      "Mobile app access",
      "Third-party integrations",
      "Advanced analytics",
    ],
    cta: "Upgrade",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 29.99,
    priceLabel: "$29.99",
    period: "month",
    features: [
      "Unlimited members",
      "Everything in Growth",
      "Custom integrations",
      "AI-powered insights",
      "Priority support",
      "Custom domain",
      "API access",
    ],
    cta: "Upgrade",
    popular: false,
  },
] as const

// Mock: replace with real subscription state from your backend
const CURRENT_PLAN_ID = "free"

export default function BillingPage() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Choose a plan that fits your club. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === CURRENT_PLAN_ID
          return (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col",
                plan.popular && "border-primary shadow-md",
                isCurrent && "ring-2 ring-primary"
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {plan.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge>Current</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.priceLabel}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  <Button
                    variant={isCurrent ? "secondary" : plan.popular ? "default" : "outline"}
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() => !isCurrent && console.log("Change plan (mock):", plan.id)}
                  >
                    {isCurrent ? plan.cta : plan.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {CURRENT_PLAN_ID === "free" ? (
            <p className="text-sm text-muted-foreground">
              Add a payment method when you upgrade to a paid plan.
            </p>
          ) : (
            <>
              <div className="text-sm">
                Visa •••• 4242
                <div className="text-xs text-muted-foreground">Expires 12/27</div>
              </div>
              <Button
                variant="outline"
                onClick={() => console.log("Update payment method (mock)")}
              >
                Update payment method
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
