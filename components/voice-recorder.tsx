"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void
  minDuration?: number
  maxDuration?: number
}

export function VoiceRecorder({ onRecordingComplete, minDuration = 30, maxDuration = 60 }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const durationRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      durationRef.current = 0

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        console.log("[v0] Recording stopped with duration:", durationRef.current)
        onRecordingComplete(audioBlob, Math.floor(durationRef.current))
        stream.getTracks().forEach((track) => track.stop())
        setDuration(0)
        durationRef.current = 0
      }

      mediaRecorder.start()
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        durationRef.current += 1
        setDuration(durationRef.current)

        if (durationRef.current >= maxDuration) {
          stopRecording()
        }
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check your browser permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const canStop = duration >= minDuration

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="relative">
        {isRecording && <div className="absolute -inset-8 rounded-full bg-red-500/10 animate-pulse" />}
        <div
          className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? "bg-gradient-to-br from-red-500/20 to-red-600/20 shadow-2xl shadow-red-500/30 border-4 border-red-500/30"
              : "bg-gradient-to-br from-primary/10 to-primary/20 shadow-xl border-4 border-primary/20"
          }`}
        >
          {isRecording ? (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/30 flex items-center justify-center animate-pulse border-2 border-red-500/40">
              <Mic className="w-14 h-14 text-red-500" />
            </div>
          ) : (
            <Mic className="w-14 h-14 text-primary" />
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="text-6xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {formatTime(duration)}
        </div>
        <div className="text-base text-muted-foreground mt-2 font-medium">
          {isRecording
            ? canStop
              ? "You can stop recording now"
              : `Record for at least ${minDuration} seconds`
            : `Record ${minDuration}-${maxDuration} seconds`}
        </div>
      </div>

      <div className="flex gap-3">
        {!isRecording ? (
          <Button
            size="lg"
            onClick={startRecording}
            className="gap-2 px-8 py-6 text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </Button>
        ) : (
          <Button
            size="lg"
            variant={canStop ? "destructive" : "secondary"}
            onClick={stopRecording}
            disabled={!canStop}
            className="gap-2 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  )
}
