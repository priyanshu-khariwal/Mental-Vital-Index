"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts"
import type { MVIAssessment } from "@/types/mvi"

interface MVITrendChartProps {
  assessments: MVIAssessment[]
}

export function MVITrendChart({ assessments }: MVITrendChartProps) {
  const chartData = assessments
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((assessment) => ({
      date: new Date(assessment.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: assessment.mvi_score,
      fullDate: new Date(assessment.created_at),
    }))

  const averageScore = Math.round(chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length)

  const latestScore = chartData[chartData.length - 1]?.score
  const previousScore = chartData[chartData.length - 2]?.score
  const trend = latestScore && previousScore ? latestScore - previousScore : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>MVI Trend Over Time</CardTitle>
        <CardDescription>Track your mental vitality journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold">{latestScore}</div>
            <div className="text-sm text-muted-foreground">Latest Score</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold">{averageScore}</div>
            <div className="text-sm text-muted-foreground">Average</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-3xl font-bold ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : ""}`}>
              {trend > 0 ? "+" : ""}
              {trend}
            </div>
            <div className="text-sm text-muted-foreground">Change</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <YAxis domain={[0, 100]} className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <ReferenceLine y={averageScore} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
