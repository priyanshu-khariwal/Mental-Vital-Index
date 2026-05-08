import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MVIScoreDisplay } from "@/components/mvi-score-display"
import { SignalBreakdown } from "@/components/signal-breakdown"
import { RecommendationsList } from "@/components/recommendations-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from("mvi_assessments")
    .select("*")
    .eq("id", id)
    .single()

  if (assessmentError || !assessment) {
    redirect("/dashboard")
  }

  // Fetch recommendations
  const { data: recommendations } = await supabase
    .from("mvi_recommendations")
    .select("*")
    .eq("assessment_id", id)
    .order("priority", { ascending: true })

  const audioSignals =
    assessment.input_type === "voice"
      ? {
          speech_rate_score: assessment.speech_rate_score,
          pause_pattern_score: assessment.pause_pattern_score,
          tone_variation_score: assessment.tone_variation_score,
          voice_energy_score: assessment.voice_energy_score,
        }
      : null

  const contentSignals = {
    sentiment_score: assessment.sentiment_score,
    stress_indicators_score: assessment.stress_indicators_score,
    coherence_score: assessment.coherence_score,
    emotional_range_score: assessment.emotional_range_score,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/dashboard" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(assessment.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <MVIScoreDisplay score={assessment.mvi_score} category={assessment.mvi_category} />

        <SignalBreakdown audioSignals={audioSignals} contentSignals={contentSignals} />

        {recommendations && recommendations.length > 0 && <RecommendationsList recommendations={recommendations} />}

        <div className="flex justify-center pt-4">
          <Button size="lg" asChild>
            <Link href="/assessment">Take Another Assessment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
