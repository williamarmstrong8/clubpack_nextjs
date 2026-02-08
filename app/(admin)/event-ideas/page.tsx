"use client"

import * as React from "react"
import { Lightbulb, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Idea = {
  id: string
  title: string
  category: "Run" | "Social" | "Training" | "Volunteer"
  effort: "Low" | "Medium" | "High"
}

const seed: Idea[] = [
  { id: "i1", title: "Sunrise coffee run", category: "Run", effort: "Low" },
  { id: "i2", title: "5K time trial", category: "Training", effort: "Medium" },
  { id: "i3", title: "Trail run + picnic", category: "Social", effort: "Medium" },
]

export default function EventIdeasPage() {
  const [ideas, setIdeas] = React.useState<Idea[]>(seed)
  const [title, setTitle] = React.useState("")

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Event ideas</h2>
        <p className="text-sm text-muted-foreground">
          A lightweight backlog for planning (mock data).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add an idea</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="ideaTitle">Idea</Label>
            <Input
              id="ideaTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Hill repeats at the reservoir"
            />
          </div>
          <Button
            onClick={() => {
              const trimmed = title.trim()
              if (!trimmed) return
              setIdeas((prev) => [
                ...prev,
                {
                  id: `i_${Math.random().toString(16).slice(2)}`,
                  title: trimmed,
                  category: "Run",
                  effort: "Low",
                },
              ])
              setTitle("")
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Idea list</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Idea</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Effort</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ideas.map((idea) => (
                  <TableRow key={idea.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-muted-foreground" />
                        {idea.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {idea.category}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{idea.effort}</Badge>
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