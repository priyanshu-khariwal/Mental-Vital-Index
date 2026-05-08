export interface MVIAssessment {
  id: string
  user_id: string
  input_type: "voice" | "text"
  transcript: string | null
  audio_duration_seconds: number | null

  // Audio signals
  speech_rate_score: number | null
  pause_pattern_score: number | null
  tone_variation_score: number | null
  voice_energy_score: number | null

  // Content signals
  sentiment_score: number | null
  stress_indicators_score: number | null
  coherence_score: number | null
  emotional_range_score: number | null

  // Final score
  mvi_score: number
  mvi_category: "critical" | "concerning" | "moderate" | "good" | "excellent"

  created_at: string
}

export interface MVIRecommendation {
  id: string
  assessment_id: string
  category: "breathing" | "sleep" | "activity" | "social" | "professional"
  title: string
  description: string
  priority: number
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  date_of_birth: string | null
  created_at: string
  updated_at: string
}
