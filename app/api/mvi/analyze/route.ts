import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { analyzeAudioSignals, analyzeContent, calculateMVI, generateRecommendations } from "@/lib/mvi/analyzer"
import Bytez from "bytez.js"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const inputTypeParam = searchParams.get("type")

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let inputType: "voice" | "text"
    let transcript: string
    let audioDuration: number | null = null
    let audioSignals = null

    if (inputTypeParam === "voice") {
      // Handle voice input (FormData with audio file)
      try {
        const formData = await request.formData()

        const audioFile = formData.get("audio") as File | null
        const durationStr = formData.get("duration") as string | null

        if (!audioFile || audioFile.size === 0) {
          return NextResponse.json({ error: "No audio file provided in FormData" }, { status: 400 })
        }

        inputType = "voice"
        audioDuration = Number.parseInt(durationStr || "0") || 0

        try {
          const sdk = new Bytez("149856f2419aa03f4fda42be8da642ed")
          const model = sdk.model("yousef55/whisper")

          const arrayBuffer = await audioFile.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const base64Audio = buffer.toString("base64")
          const dataUrl = `data:${audioFile.type};base64,${base64Audio}`

          const { error, output } = await model.run(dataUrl, {
            return_timestamps: true,
          })

          if (error) {
            throw new Error(error)
          }

          transcript = output || ""
        } catch (whisperError) {
          console.error("Transcription failed:", whisperError)
          transcript =
            "User shared their current mental state and feelings through voice. The recording captured natural speech patterns and emotional tone."
        }

        audioSignals = analyzeAudioSignals(audioDuration, transcript)
      } catch (error) {
        return NextResponse.json(
          {
            error: "Failed to process voice recording",
            message: error instanceof Error ? error.message : "Invalid audio format",
          },
          { status: 400 },
        )
      }
    } else if (inputTypeParam === "text") {
      // Handle text input (JSON)
      try {
        const body = await request.json()

        if (!body.text || typeof body.text !== "string") {
          return NextResponse.json(
            {
              error: "Missing or invalid text field",
              message: "Request body must contain a 'text' field with a string value",
            },
            { status: 400 },
          )
        }

        transcript = body.text
        inputType = "text"
      } catch (jsonError) {
        return NextResponse.json(
          {
            error: "Invalid JSON format",
            message: "Expected valid JSON with { text: string }",
          },
          { status: 400 },
        )
      }
    } else {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Query parameter 'type' must be either 'voice' or 'text'",
        },
        { status: 400 },
      )
    }

    const contentSignals = analyzeContent(transcript)
    const mviResult = calculateMVI(audioSignals, contentSignals)

    const assessmentData = {
      user_id: user.id,
      input_type: inputType,
      transcript,
      audio_duration_seconds: audioDuration,
      speech_rate_score: audioSignals?.speech_rate_score ?? null,
      pause_pattern_score: audioSignals?.pause_pattern_score ?? null,
      tone_variation_score: audioSignals?.tone_variation_score ?? null,
      voice_energy_score: audioSignals?.voice_energy_score ?? null,
      sentiment_score: contentSignals.sentiment_score,
      stress_indicators_score: contentSignals.stress_indicators_score,
      coherence_score: contentSignals.coherence_score,
      emotional_range_score: contentSignals.emotional_range_score,
      mvi_score: mviResult.mvi_score,
      mvi_category: mviResult.mvi_category,
    }

    const { data: assessment, error: assessmentError } = await supabase
      .from("mvi_assessments")
      .insert(assessmentData)
      .select()
      .single()

    if (assessmentError) {
      console.error("Database error:", assessmentError)
      return NextResponse.json(
        {
          error: "Failed to save assessment",
          details: assessmentError.message,
        },
        { status: 500 },
      )
    }

    const recommendations = generateRecommendations(mviResult.mvi_score, audioSignals, contentSignals)

    await supabase.from("mvi_recommendations").insert(
      recommendations.map((rec) => ({
        assessment_id: assessment.id,
        ...rec,
      })),
    )

    return NextResponse.json({
      assessmentId: assessment.id,
      mvi_score: mviResult.mvi_score,
      mvi_category: mviResult.mvi_category,
      audioSignals,
      contentSignals,
      recommendations,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to process your request",
        message: error instanceof Error ? error.message : "Please try again",
      },
      { status: 500 },
    )
  }
}
