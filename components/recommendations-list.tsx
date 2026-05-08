import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Moon, Activity, Users, Stethoscope } from "lucide-react"
import type { MVIRecommendation } from "@/types/mvi"

interface RecommendationsListProps {
  recommendations: MVIRecommendation[]
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "breathing":
        return Wind
      case "sleep":
        return Moon
      case "activity":
        return Activity
      case "social":
        return Users
      case "professional":
        return Stethoscope
      default:
        return Activity
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breathing":
        return "bg-cyan-100 text-cyan-700"
      case "sleep":
        return "bg-indigo-100 text-indigo-700"
      case "activity":
        return "bg-green-100 text-green-700"
      case "social":
        return "bg-purple-100 text-purple-700"
      case "professional":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => a.priority - b.priority)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
        <CardDescription>Action steps to improve your mental vitality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedRecommendations.map((rec) => {
          const Icon = getCategoryIcon(rec.category)
          const colorClass = getCategoryColor(rec.category)

          return (
            <div key={rec.id} className="flex gap-4 p-4 rounded-lg border bg-card">
              <div className={`${colorClass} rounded-full p-3 h-fit`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{rec.title}</h3>
                  <Badge variant={rec.priority === 1 ? "destructive" : "secondary"} className="shrink-0">
                    {rec.priority === 1 ? "High Priority" : "Priority " + rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
