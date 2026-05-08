import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MVITrendChart } from "@/components/mvi-trend-chart"
import { AssessmentHistory } from "@/components/assessment-history"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's assessments
  const { data: assessments } = await supabase
    .from("mvi_assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const hasAssessments = assessments && assessments.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mental Vitality Dashboard</h1>
            <p className="text-muted-foreground">Track your mental health journey over time</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/assessment" className="gap-2">
              <Plus className="w-5 h-5" />
              New Assessment
            </Link>
          </Button>
        </div>

        {hasAssessments ? (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-3">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{assessments.length}</div>
                      <div className="text-sm text-muted-foreground">Total Assessments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">
                        {Math.round(assessments.reduce((sum, a) => sum + a.mvi_score, 0) / assessments.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">Average MVI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{assessments[0].mvi_score}</div>
                      <div className="text-sm text-muted-foreground">Latest Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {assessments.length > 1 && <MVITrendChart assessments={assessments} />}

            <AssessmentHistory assessments={assessments} />
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Welcome to Mental Vital Index</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start tracking your mental vitality by taking your first assessment. Regular check-ins help you
                understand patterns and improve your wellbeing.
              </p>
              <Button size="lg" asChild>
                <Link href="/assessment" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Take Your First Assessment
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
