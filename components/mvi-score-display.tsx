import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"

interface MVIScoreDisplayProps {
  score: number
  category: "critical" | "concerning" | "moderate" | "good" | "excellent"
}

export function MVIScoreDisplay({ score, category }: MVIScoreDisplayProps) {
  const getCategoryConfig = () => {
    switch (category) {
      case "excellent":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
          label: "Excellent",
          description: "Your mental vitality is strong and thriving",
        }
      case "good":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          icon: TrendingUp,
          label: "Good",
          description: "You're doing well with room for growth",
        }
      case "moderate":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: Activity,
          label: "Moderate",
          description: "Some areas need attention and care",
        }
      case "concerning":
        return {
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          icon: AlertTriangle,
          label: "Concerning",
          description: "Consider taking action to improve wellbeing",
        }
      case "critical":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: AlertCircle,
          label: "Critical",
          description: "We recommend seeking professional support",
        }
    }
  }

  const config = getCategoryConfig()
  const Icon = config.icon

  return (
    <Card className={`${config.borderColor} border-2 shadow-xl hover:shadow-2xl transition-all`}>
      <CardHeader className="pb-8">
        <CardTitle className="text-center text-3xl">Your Mental Vital Index</CardTitle>
        <CardDescription className="text-center text-lg">Based on your recent assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center gap-6">
          <div className={`${config.bgColor} rounded-full p-10 shadow-lg border-4 ${config.borderColor}`}>
            <Icon className={`w-20 h-20 ${config.color}`} />
          </div>

          <div className="text-center space-y-3">
            <div className="text-7xl md:text-8xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {score}
            </div>
            <div className="text-base text-muted-foreground font-medium">out of 100</div>
          </div>

          <div className={`${config.bgColor} px-8 py-3 rounded-full border-2 ${config.borderColor} shadow-md`}>
            <span className={`${config.color} font-bold text-lg`}>{config.label}</span>
          </div>

          <p className="text-center text-muted-foreground max-w-md text-lg leading-relaxed">{config.description}</p>
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${config.bgColor} ${config.color} bg-current transition-all duration-1000 ease-out shadow-lg`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground font-medium">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
