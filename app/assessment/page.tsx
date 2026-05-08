"use client"

import { useState } from "react"
import { InputModeSelector } from "@/components/input-mode-selector"
import { MVIScoreDisplay } from "@/components/mvi-score-display"
import { SignalBreakdown } from "@/components/signal-breakdown"
import { RecommendationsList } from "@/components/recommendations-list"
import { Button } from "@/components/ui/button"
import { Loader2, RotateCcw } from "lucide-react"

interface AssessmentResult {
  assessmentId: string
  mvi_score: number
  mvi_category: "critical" | "concerning" | "moderate" | "good" | "excellent"
  audioSignals?: {
    speech_rate_score: number
    pause_pattern_score: number
    tone_variation_score: number
    voice_energy_score: number
  }
  contentSignals: {
    sentiment_score: number
    stress_indicators_score: number
    coherence_score: number
    emotional_range_score: number
  }
  recommendations: Array<{
    category: "breathing" | "sleep" | "activity" | "social" | "professional"
    title: string
    description: string
    priority: number
  }>
}

export default function AssessmentPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  const handleVoiceSubmit = async (audioBlob: Blob, duration: number) => {
    setIsProcessing(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")
      formData.append("duration", duration.toString())

      const response = await fetch("/api/mvi/analyze?type=voice", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.message || errorData.error || `Analysis failed`)
      }

      const data = await response.json()

      setResult(data)
    } catch (error) {
      console.error("Error processing voice:", error)
      alert(`Failed to process your recording: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTextSubmit = async (text: string) => {
    setIsProcessing(true)
    setResult(null)
    try {
      const response = await fetch("/api/mvi/analyze?type=text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.message || errorData.error || `Analysis failed`)
      }

      const data = await response.json()

      setResult(data)
    } catch (error) {
      console.error("Error processing text:", error)
      alert(`Failed to process your response: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTakeAnother = () => {
    setResult(null)
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative rounded-full bg-primary/10 p-6 backdrop-blur-sm border-2 border-primary/30">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          </div>
          <div className="text-2xl font-semibold">Analyzing your response...</div>
          <div className="text-muted-foreground text-lg">This may take a moment</div>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-5xl mx-auto space-y-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Assessment Results</h1>
              <p className="text-muted-foreground text-lg">Understanding your mental vitality</p>
            </div>
            <Button
              onClick={handleTakeAnother}
              variant="outline"
              className="gap-2 border-2 shadow-sm hover:shadow-md transition-all bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
              Take Another Assessment
            </Button>
          </div>

          <MVIScoreDisplay score={result.mvi_score} category={result.mvi_category} />

          <SignalBreakdown audioSignals={result.audioSignals || null} contentSignals={result.contentSignals} />

          {result.recommendations && result.recommendations.length > 0 && (
            <RecommendationsList
              recommendations={result.recommendations.map((rec, index) => ({
                id: `rec-${index}`,
                assessment_id: result.assessmentId,
                ...rec,
                created_at: new Date().toISOString(),
              }))}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/30 to-background">
      <InputModeSelector onVoiceSubmit={handleVoiceSubmit} onTextSubmit={handleTextSubmit} />
    </div>
  )
}
