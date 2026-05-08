interface AudioAnalysis {
  speech_rate_score: number
  pause_pattern_score: number
  tone_variation_score: number
  voice_energy_score: number
}

interface ContentAnalysis {
  sentiment_score: number
  stress_indicators_score: number
  coherence_score: number
  emotional_range_score: number
}

interface MVIResult {
  mvi_score: number
  mvi_category: "critical" | "concerning" | "moderate" | "good" | "excellent"
  audio_signals: AudioAnalysis | null
  content_signals: ContentAnalysis
}

// Simulated audio analysis - in production, this would use actual speech processing
export function analyzeAudioSignals(duration: number, transcript: string): AudioAnalysis {
  // Speech rate analysis (words per minute)
  const words = transcript.split(/\s+/).filter(Boolean).length
  const wordsPerMinute = (words / duration) * 60
  const speech_rate_score = Math.min(100, Math.max(0, 100 - Math.abs(wordsPerMinute - 150) / 2))

  // Pause pattern analysis (simulated based on punctuation and sentence structure)
  const sentences = transcript.split(/[.!?]+/).filter(Boolean).length
  const avgWordsPerSentence = words / Math.max(sentences, 1)
  const pause_pattern_score = Math.min(100, avgWordsPerSentence * 8)

  // Tone variation (simulated based on text variety)
  const uniqueWords = new Set(transcript.toLowerCase().split(/\s+/)).size
  const lexicalDiversity = uniqueWords / Math.max(words, 1)
  const tone_variation_score = Math.min(100, lexicalDiversity * 150)

  // Voice energy (simulated based on exclamation marks and capitalization)
  const energyMarkers = (transcript.match(/[!]/g) || []).length + (transcript.match(/[A-Z]{2,}/g) || []).length
  const voice_energy_score = Math.min(100, 50 + energyMarkers * 10)

  return {
    speech_rate_score: Math.round(speech_rate_score),
    pause_pattern_score: Math.round(pause_pattern_score),
    tone_variation_score: Math.round(tone_variation_score),
    voice_energy_score: Math.round(voice_energy_score),
  }
}

// Content analysis using sentiment and linguistic patterns
export function analyzeContent(text: string): ContentAnalysis {
  const lowerText = text.toLowerCase()

  console.log("[v0] Analyzing text:", text.substring(0, 100) + "...")

  const positiveWords = [
    "good",
    "great",
    "happy",
    "excellent",
    "wonderful",
    "better",
    "fine",
    "well",
    "love",
    "enjoy",
    "amazing",
    "fantastic",
    "blessed",
    "grateful",
    "thankful",
    "excited",
    "optimistic",
    "positive",
    "confident",
    "content",
    "satisfied",
    "pleased",
    "delighted",
    "joyful",
    "cheerful",
    "peaceful",
    "calm",
    "relaxed",
    "balanced",
    "energized",
    "motivated",
    "focused",
    "clear",
    "refreshed",
    "comfortable",
    "ease",
    "light",
    "connected",
    "healthy",
    "strong",
    "capable",
    "hopeful",
    "honestly",
  ]

  const negativeWords = [
    "bad",
    "sad",
    "angry",
    "terrible",
    "awful",
    "worse",
    "depressed",
    "anxious",
    "worried",
    "stressed",
    "miserable",
    "unhappy",
    "disappointed",
    "frustrated",
    "upset",
    "hurt",
    "pain",
    "suffering",
    "lonely",
    "isolated",
    "empty",
    "hopeless",
    "helpless",
    "worthless",
    "guilty",
    "ashamed",
    "fearful",
    "scared",
    "nervous",
    "tense",
    "overwhelmed",
    "exhausted",
    "drained",
    "broken",
    "tired",
    "fatigue",
    "weary",
    "heavy",
    "heavier",
    "difficult",
    "hard",
    "struggle",
    "struggling",
    "stuck",
    "lost",
    "losing",
    "slow",
    "crowded",
    "numb",
    "dark",
    "burden",
    "weight",
    "draining",
    "drain",
    "effort",
    "unmotivated",
    "disinterested",
    "apathetic",
    "withdrawn",
    "weak",
    "fragile",
    "unstable",
    "crying",
    "tears",
    "sleepless",
    "insomnia",
    "irritated",
    "irritable",
    "restless",
    "uneasy",
    "insecure",
    "doubtful",
    "fatigued",
    "burned-out",
    "burnout",
    "burnt",
    "discouraged",
    "confused",
    "scattered",
    "unfocused",
    "pressured",
    "pressure",
    "panic",
    "panicked",
    "agitated",
    "strained",
    "low",
    "gloomy",
    "negative",
    "pessimistic",
    "defeated",
    "overloaded",
    "disconnected",
    "demotivated",
    "irrational",
    "self-doubting",
    "tearful",
    "overthinking",
    "worn-out",
    "hopelessness",
    "fear-driven",
    "stress-filled",
    "emotionally-drained",
    "mentally-exhausted",
    "unstable",
    "unsettled",
    "vulnerable",
    "low-energy",
    "distressed",
    "disturbance",
    "overstretched",
    "breakdown",
    "crisis",
    "emergency",
    "can't",
    "cannot",
    "unable",
    "fail",
    "failed",
    "failing",
    "giving up",
    "quit",
    "pointless",
    "meaningless",
    "useless",
    "inadequate",
    "inferior",
    "regret",
    "remorse",
    "resentment",
    "bitter",
    "rage",
    "hostile",
    "aggressive",
    "violent",
    "hate",
    "disgusted",
    "revolted",
    "nauseated",
    "sick",
    "ill",
    "unwell",
    "aching",
    "sore",
    "uncomfortable",
    "rushed",
  ]

  let positiveCount = 0
  let negativeCount = 0
  const positiveMatches: string[] = []
  const negativeMatches: string[] = []

  // Detect negation patterns like "not stressed", "don't feel anxious", "no worry"
  const negationPatterns = [
    "not ",
    "don't ",
    "dont ",
    "doesn't ",
    "doesnt ",
    "no ",
    "never ",
    "hardly ",
    "barely ",
    "without ",
  ]

  // Count positive words (not negated)
  for (const word of positiveWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) {
      // Check if any match is preceded by negation (within 10 characters)
      for (const match of matches) {
        const index = lowerText.indexOf(match)
        const precedingText = lowerText.substring(Math.max(0, index - 10), index)
        const isNegated = negationPatterns.some((neg) => precedingText.includes(neg))
        if (!isNegated) {
          positiveCount++
          positiveMatches.push(word)
        }
      }
    }
  }

  // Count negative words (only if NOT negated, since "not tired" is actually positive)
  for (const word of negativeWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) {
      for (const match of matches) {
        const index = lowerText.indexOf(match)
        const precedingText = lowerText.substring(Math.max(0, index - 10), index)
        const isNegated = negationPatterns.some((neg) => precedingText.includes(neg))
        if (isNegated) {
          // Negated negative word becomes positive
          positiveCount++
          positiveMatches.push(`NOT-${word}`)
        } else {
          negativeCount++
          negativeMatches.push(word)
        }
      }
    }
  }

  console.log("[v0] Positive words found:", positiveMatches)
  console.log("[v0] Positive count:", positiveCount)
  console.log("[v0] Negative words found:", negativeMatches)
  console.log("[v0] Negative count:", negativeCount)

  const sentimentRaw = 50 + positiveCount * 10 - negativeCount * 15
  console.log(
    "[v0] Sentiment raw calculation: 50 + " + positiveCount + " * 10 - " + negativeCount + " * 15 = " + sentimentRaw,
  )
  const sentiment_score = Math.min(100, Math.max(0, sentimentRaw))
  console.log("[v0] Sentiment score (capped 0-100):", sentiment_score)

  // Coherence - sentence structure and logical flow
  const sentences = text.split(/[.!?]+/).filter(Boolean)
  const words = text.split(/\s+/).filter(Boolean)
  const avgSentenceLength = words.length / Math.max(sentences.length, 1)
  const coherence_score = Math.min(100, Math.max(40, 100 - Math.abs(avgSentenceLength - 15) * 2))

  // Emotional range - variety of emotional expression
  const emotionalWords = [
    ...positiveWords,
    ...negativeWords,
    "feel",
    "feeling",
    "think",
    "believe",
    "hope",
    "wish",
    "want",
    "sense",
    "experience",
  ]
  const emotionalDiversity = emotionalWords.filter((word) => lowerText.includes(word)).length
  const emotional_range_score = Math.min(100, Math.max(30, emotionalDiversity * 6))

  const stressWords = [
    "stress",
    "stressful",
    "pressure",
    "overwhelm",
    "anxiety",
    "panic",
    "worry",
    "exhausted",
    "tired",
    "can't",
    "unable",
    "difficult",
    "hard",
    "struggle",
    "burden",
    "crisis",
    "emergency",
    "effort",
    "rushed",
  ]

  let stressCount = 0
  const stressMatches: string[] = []
  for (const word of stressWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) {
      for (const match of matches) {
        const index = lowerText.indexOf(match)
        const precedingText = lowerText.substring(Math.max(0, index - 10), index)
        const isNegated = negationPatterns.some((neg) => precedingText.includes(neg))
        if (!isNegated) {
          stressCount++
          stressMatches.push(word)
        }
      }
    }
  }

  console.log("[v0] Stress words found:", stressMatches)
  console.log("[v0] Stress count:", stressCount)

  const depressionIndicators = [
    "not feeling good",
    "don't feel good",
    "lost interest",
    "no motivation",
    "can't manage",
    "hard to manage",
    "feel stuck",
    "giving up",
    "no energy",
    "no point",
    "emotionally drain",
  ]
  const depressionCount = depressionIndicators.filter((phrase) => lowerText.includes(phrase)).length

  const stress_indicators_score = Math.min(100, Math.max(0, 100 - (stressCount + depressionCount * 2) * 10))
  console.log("[v0] Stress indicators score:", stress_indicators_score)

  console.log("[v0] Final content signals:", {
    sentiment_score,
    stress_indicators_score,
    coherence_score,
    emotional_range_score,
  })

  return {
    sentiment_score: Math.round(sentiment_score),
    stress_indicators_score: Math.round(stress_indicators_score),
    coherence_score: Math.round(coherence_score),
    emotional_range_score: Math.round(emotional_range_score),
  }
}

// Calculate final MVI score from all signals
export function calculateMVI(audioSignals: AudioAnalysis | null, contentSignals: ContentAnalysis): MVIResult {
  const contentWeight = audioSignals ? 0.6 : 1.0

  // Sentiment is the most important signal (50%)
  const sentimentContribution = contentSignals.sentiment_score * 0.5

  // Stress indicators (25%)
  const stressContribution = contentSignals.stress_indicators_score * 0.25

  // Coherence (15%)
  const coherenceContribution = contentSignals.coherence_score * 0.15

  // Emotional range (10%)
  const emotionalRangeContribution = contentSignals.emotional_range_score * 0.1

  const contentAvg = sentimentContribution + stressContribution + coherenceContribution + emotionalRangeContribution

  console.log("[v0] Content signal contributions:", {
    sentiment: sentimentContribution,
    stress: stressContribution,
    coherence: coherenceContribution,
    emotionalRange: emotionalRangeContribution,
    contentAvg,
  })

  let totalScore = 0
  let signalCount = 0

  // Weight audio signals if available (40% of total)
  if (audioSignals) {
    const audioAvg =
      (audioSignals.speech_rate_score +
        audioSignals.pause_pattern_score +
        audioSignals.tone_variation_score +
        audioSignals.voice_energy_score) /
      4
    totalScore += audioAvg * 0.4
    signalCount += 0.4
  }

  totalScore += contentAvg * contentWeight
  signalCount += contentWeight

  const mvi_score = Math.round(totalScore / signalCount)

  console.log("[v0] Final MVI score:", mvi_score)

  // Categorize MVI score
  let mvi_category: "critical" | "concerning" | "moderate" | "good" | "excellent"
  if (mvi_score >= 80) mvi_category = "excellent"
  else if (mvi_score >= 65) mvi_category = "good"
  else if (mvi_score >= 50) mvi_category = "moderate"
  else if (mvi_score >= 35) mvi_category = "concerning"
  else mvi_category = "critical"

  return {
    mvi_score,
    mvi_category,
    audio_signals: audioSignals,
    content_signals: contentSignals,
  }
}

// Generate personalized recommendations based on MVI analysis
export function generateRecommendations(
  mviScore: number,
  audioSignals: AudioAnalysis | null,
  contentSignals: ContentAnalysis,
) {
  const recommendations: Array<{
    category: "breathing" | "sleep" | "activity" | "social" | "professional" | "mindfulness" | "nutrition"
    title: string
    description: string
    priority: number
  }> = []

  // Critical - Professional help (priority 1)
  if (mviScore < 35) {
    recommendations.push({
      category: "professional",
      title: "Seek Immediate Professional Support",
      description:
        "Your MVI score indicates significant distress. Please contact a mental health professional or crisis hotline immediately. You don't have to face this alone.",
      priority: 1,
    })
  } else if (mviScore < 50) {
    recommendations.push({
      category: "professional",
      title: "Consider Professional Support",
      description:
        "Your scores suggest you may benefit from speaking with a mental health professional such as a therapist or counselor. They can provide personalized strategies and support.",
      priority: 1,
    })
  }

  // Breathing exercises - for stress and anxiety
  if (contentSignals.stress_indicators_score < 60) {
    recommendations.push({
      category: "breathing",
      title: "Deep Breathing Exercise (4-7-8 Method)",
      description:
        "Practice 4-7-8 breathing: Inhale through nose for 4 seconds, hold for 7 seconds, exhale through mouth for 8 seconds. Repeat 4 times, twice daily. This activates your parasympathetic nervous system.",
      priority: 1,
    })
    recommendations.push({
      category: "breathing",
      title: "Box Breathing Technique",
      description:
        "Inhale for 4 counts, hold for 4 counts, exhale for 4 counts, hold for 4 counts. Repeat for 5 minutes when feeling overwhelmed. Used by Navy SEALs for stress management.",
      priority: 2,
    })
  } else if (contentSignals.stress_indicators_score < 75) {
    recommendations.push({
      category: "breathing",
      title: "Daily Breathing Practice",
      description:
        "Set aside 5 minutes each morning for mindful breathing. Focus on the sensation of breath entering and leaving your body. This builds stress resilience over time.",
      priority: 3,
    })
  }

  // Sleep recommendations
  if ((audioSignals && audioSignals.voice_energy_score < 50) || contentSignals.coherence_score < 55) {
    recommendations.push({
      category: "sleep",
      title: "Establish a Sleep Routine",
      description:
        "Aim for 7-9 hours of sleep. Go to bed and wake up at the same time daily, even on weekends. This regulates your circadian rhythm and improves mood.",
      priority: 2,
    })
    recommendations.push({
      category: "sleep",
      title: "Optimize Your Sleep Environment",
      description:
        "Keep bedroom cool (60-67°F), dark, and quiet. Avoid screens 1 hour before bed. Blue light suppresses melatonin production and disrupts sleep quality.",
      priority: 2,
    })
  } else if (mviScore < 70) {
    recommendations.push({
      category: "sleep",
      title: "Wind-Down Routine",
      description:
        "Create a 30-minute pre-sleep routine: dim lights, read a book, practice gentle stretching, or listen to calming music. This signals your body it's time to rest.",
      priority: 3,
    })
  }

  // Physical activity - graduated approach based on score
  if (mviScore < 50) {
    recommendations.push({
      category: "activity",
      title: "Start with Gentle Movement",
      description:
        "Take a 10-15 minute walk outdoors daily, preferably in nature. Even light movement releases endorphins and reduces stress hormones like cortisol.",
      priority: 2,
    })
  } else if (mviScore < 70) {
    recommendations.push({
      category: "activity",
      title: "Increase Physical Activity",
      description:
        "Aim for 30 minutes of moderate exercise 3-4 times weekly. Try walking, swimming, cycling, or yoga. Regular exercise improves mood and cognitive function.",
      priority: 2,
    })
  } else {
    recommendations.push({
      category: "activity",
      title: "Maintain Your Activity Level",
      description:
        "Continue your current exercise routine. Consider adding variety with new activities to keep motivation high and challenge different muscle groups.",
      priority: 3,
    })
  }

  // Social connection - based on emotional range
  if (contentSignals.emotional_range_score < 40) {
    recommendations.push({
      category: "social",
      title: "Reach Out for Connection",
      description:
        "Social isolation can worsen mental health. Contact a trusted friend or family member for a 10-minute conversation. Connection is a biological need.",
      priority: 2,
    })
    recommendations.push({
      category: "social",
      title: "Join a Support Group",
      description:
        "Consider joining a mental health support group (online or in-person). Sharing experiences with others who understand can be powerfully healing.",
      priority: 3,
    })
  } else if (contentSignals.emotional_range_score < 60) {
    recommendations.push({
      category: "social",
      title: "Schedule Regular Social Time",
      description:
        "Plan at least one meaningful social interaction weekly. Quality matters more than quantity - focus on relationships that energize rather than drain you.",
      priority: 3,
    })
  }

  // Mindfulness and meditation
  if (contentSignals.coherence_score < 60 || contentSignals.stress_indicators_score < 65) {
    recommendations.push({
      category: "mindfulness",
      title: "Begin a Meditation Practice",
      description:
        "Start with 5 minutes daily of guided meditation using apps like Headspace, Calm, or Insight Timer. Meditation reduces anxiety and improves emotional regulation.",
      priority: 2,
    })
    recommendations.push({
      category: "mindfulness",
      title: "Practice Grounding Techniques",
      description:
        "When anxious, use the 5-4-3-2-1 method: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This brings you back to the present moment.",
      priority: 2,
    })
  } else if (mviScore >= 70) {
    recommendations.push({
      category: "mindfulness",
      title: "Deepen Your Mindfulness Practice",
      description:
        "You're doing well! Consider expanding to 15-20 minute sessions or try different techniques like body scan meditation, loving-kindness meditation, or mindful walking.",
      priority: 4,
    })
  }

  // Nutrition and lifestyle
  if (mviScore < 60) {
    recommendations.push({
      category: "nutrition",
      title: "Optimize Your Nutrition",
      description:
        "Eat regular, balanced meals with protein, healthy fats, and complex carbs. Avoid excessive caffeine (limit to 2 cups daily) and stay hydrated with 8 glasses of water.",
      priority: 3,
    })
    recommendations.push({
      category: "nutrition",
      title: "Limit Alcohol and Substances",
      description:
        "Alcohol and recreational drugs can worsen anxiety and depression. If you use them to cope, consider speaking with a healthcare provider about healthier alternatives.",
      priority: 2,
    })
  }

  // Stress management techniques
  if (contentSignals.stress_indicators_score < 55) {
    recommendations.push({
      category: "activity",
      title: "Progressive Muscle Relaxation",
      description:
        "Tense and release each muscle group from toes to head, holding tension for 5 seconds then releasing. Do this before bed to release physical stress.",
      priority: 3,
    })
  }

  // Positive reinforcement for good scores
  if (mviScore >= 80) {
    recommendations.push({
      category: "mindfulness",
      title: "Maintain Your Excellent Progress",
      description:
        "Your MVI score is excellent! Continue your current self-care practices. Consider journaling what's working well so you can refer back during tougher times.",
      priority: 4,
    })
    recommendations.push({
      category: "social",
      title: "Support Others",
      description:
        "You're in a strong position to help others. Consider volunteering or mentoring someone who might benefit from your experiences and recovery journey.",
      priority: 4,
    })
  } else if (mviScore >= 70) {
    recommendations.push({
      category: "mindfulness",
      title: "Build on Your Success",
      description:
        "You're doing well! This is a great time to establish sustainable habits. Focus on consistency rather than intensity in your self-care routines.",
      priority: 4,
    })
  }

  // Cognitive strategies
  if (contentSignals.sentiment_score < 50) {
    recommendations.push({
      category: "mindfulness",
      title: "Challenge Negative Thoughts",
      description:
        "Practice cognitive reframing: When you notice negative thoughts, ask 'Is this thought true? Is there another way to view this?' Write down evidence for and against the thought.",
      priority: 2,
    })
  }

  // Return sorted by priority
  return recommendations.sort((a, b) => a.priority - b.priority)
}
