import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, ArrowRight, Mic, MessageSquare } from "lucide-react"
import type { MVIAssessment } from "@/types/mvi"

interface AssessmentHistoryProps {
  assessments: MVIAssessment[]
}

export function AssessmentHistory({ assessments }: AssessmentHistoryProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "excellent":
        return "bg-green-100 text-green-700"
      case "good":
        return "bg-blue-100 text-blue-700"
      case "moderate":
        return "bg-yellow-100 text-yellow-700"
      case "concerning":
        return "bg-orange-100 text-orange-700"
      case "critical":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment History</CardTitle>
        <CardDescription>Your recent mental vitality assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full p-2">
                  {assessment.input_type === "voice" ? (
                    <Mic className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-2xl tabular-nums">{assessment.mvi_score}</span>
                    <Badge className={getCategoryColor(assessment.mvi_category)}>{assessment.mvi_category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(assessment.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/results/${assessment.id}`} className="gap-2">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ))}
          {sortedAssessments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No assessments yet. Take your first assessment to start tracking your mental vitality.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
