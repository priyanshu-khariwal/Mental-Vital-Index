import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { MVIAssessment } from "@/types/mvi"

interface PatientOverviewCardProps {
  patientId: string
  patientName: string
  assessments: MVIAssessment[]
}

export function PatientOverviewCard({ patientId, patientName, assessments }: PatientOverviewCardProps) {
  if (assessments.length === 0) {
    return null
  }

  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const latestAssessment = sortedAssessments[0]
  const previousAssessment = sortedAssessments[1]

  const trend = previousAssessment ? latestAssessment.mvi_score - previousAssessment.mvi_score : 0

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

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  const averageScore = Math.round(assessments.reduce((sum, a) => sum + a.mvi_score, 0) / assessments.length)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{patientName || "Patient"}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">{assessments.length} assessments</div>
          </div>
          <Badge className={getCategoryColor(latestAssessment.mvi_category)}>{latestAssessment.mvi_category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums">{latestAssessment.mvi_score}</div>
            <div className="text-xs text-muted-foreground">Latest</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums">{averageScore}</div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {getTrendIcon()}
              <span className="text-2xl font-bold tabular-nums">{Math.abs(trend)}</span>
            </div>
            <div className="text-xs text-muted-foreground">Change</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
            <Link href={`/provider/patient/${patientId}`}>View Trends</Link>
          </Button>
          <Button size="sm" asChild className="flex-1">
            <Link href={`/provider/patient/${patientId}/notes`}>Add Note</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
