"use client"

import { FileText, Upload } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const waivers = [
  { id: "w1", name: "General Liability Waiver", status: "Active", signed: 183 },
  { id: "w2", name: "Minor Release Form", status: "Draft", signed: 0 },
]

export default function WaiversPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Waivers</h2>
          <p className="text-sm text-muted-foreground">
            Manage waiver templates and signatures (mock).
          </p>
        </div>
        <Button variant="outline" onClick={() => console.log("Upload waiver (mock)")}>
          <Upload className="mr-2 h-4 w-4" />
          Upload PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Waiver templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Signed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waivers.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {w.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      {w.status === "Active" ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {w.signed}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}