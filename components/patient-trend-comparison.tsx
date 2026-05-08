"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import type { MVIAssessment } from "@/types/mvi"

interface PatientTrendComparisonProps {
  patientName: string
  assessments: MVIAssessment[]
}

export function PatientTrendComparison({ patientName, assessments }: PatientTrendComparisonProps) {
  const chartData = assessments
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((assessment) => ({
      date: new Date(assessment.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      mvi: assessment.mvi_score,
      sentiment: assessment.sentiment_score,
      stress: assessment.stress_indicators_score,
      coherence: assessment.coherence_score,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Trend Analysis</CardTitle>
        <CardDescription>MVI and component signals for {patientName}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
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
            <Legend />
            <Line type="monotone" dataKey="mvi" stroke="#2563eb" strokeWidth={3} name="MVI Score" />
            <Line type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={2} name="Sentiment" />
            <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress Control" />
            <Line type="monotone" dataKey="coherence" stroke="#8b5cf6" strokeWidth={2} name="Coherence" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
