import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const stats = [
  { title: "Site visits", value: "12.4k", delta: "+8%" },
  { title: "New members", value: "38", delta: "+12" },
  { title: "Event RSVPs", value: "214", delta: "+31" },
]

export default function AnalyticsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          High-level club metrics (mock data).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.title}
              </CardTitle>
              <Badge variant="secondary">{s.delta}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <div className="grid gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-[92%]" />
            <Skeleton className="h-10 w-[96%]" />
            <Skeleton className="h-10 w-[88%]" />
          </div>
          <p className="text-sm text-muted-foreground">
            Charts and real analytics will be wired up when backend/Supabase is
            ported.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
