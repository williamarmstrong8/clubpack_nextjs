"use client"

import { CreditCard } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function BillingPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Subscription and payment info (mock).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Plan</CardTitle>
            <Badge>Pro</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              $49/month • Renews on Mar 1, 2026
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => console.log("Manage plan (mock)")}>
                Manage plan
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("View invoices (mock)")}
              >
                View invoices
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Payment method</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              Visa •••• 4242
              <div className="text-xs text-muted-foreground">
                Expires 12/27
              </div>
            </div>
            <Separator />
            <Button
              variant="outline"
              onClick={() => console.log("Update payment method (mock)")}
            >
              Update payment method
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}