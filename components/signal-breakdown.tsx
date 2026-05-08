import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Signal {
  label: string
  score: number | null
  description: string
}

interface SignalBreakdownProps {
  audioSignals?: {
    speech_rate_score: number
    pause_pattern_score: number
    tone_variation_score: number
    voice_energy_score: number
  } | null
  contentSignals: {
    sentiment_score: number
    stress_indicators_score: number
    coherence_score: number
    emotional_range_score: number
  }
}

export function SignalBreakdown({ audioSignals, contentSignals }: SignalBreakdownProps) {
  const audioSignalsList: Signal[] = audioSignals
    ? [
        {
          label: "Speech Rate",
          score: audioSignals.speech_rate_score,
          description: "Natural speaking pace and rhythm",
        },
        {
          label: "Pause Patterns",
          score: audioSignals.pause_pattern_score,
          description: "Comfortable breathing and thinking pauses",
        },
        {
          label: "Tone Variation",
          score: audioSignals.tone_variation_score,
          description: "Emotional expression and vocal range",
        },
        {
          label: "Voice Energy",
          score: audioSignals.voice_energy_score,
          description: "Overall vitality and engagement",
        },
      ]
    : []

  const contentSignalsList: Signal[] = [
    {
      label: "Sentiment",
      score: contentSignals.sentiment_score,
      description: "Overall emotional tone and positivity",
    },
    {
      label: "Stress Level",
      score: contentSignals.stress_indicators_score,
      description: "Presence of stress and anxiety markers",
    },
    {
      label: "Coherence",
      score: contentSignals.coherence_score,
      description: "Clarity of thought and expression",
    },
    {
      label: "Emotional Range",
      score: contentSignals.emotional_range_score,
      description: "Variety and depth of emotional expression",
    },
  ]

  const SignalCard = ({ title, signals }: { title: string; signals: Signal[] }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Individual components contributing to your MVI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {signals.map((signal) => (
          <div key={signal.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{signal.label}</div>
                <div className="text-sm text-muted-foreground">{signal.description}</div>
              </div>
              <div className="text-2xl font-bold tabular-nums">{signal.score}</div>
            </div>
            <Progress value={signal.score || 0} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {audioSignals && <SignalCard title="Voice Analysis" signals={audioSignalsList} />}
      <SignalCard title="Content Analysis" signals={contentSignalsList} />
    </div>
  )
}
