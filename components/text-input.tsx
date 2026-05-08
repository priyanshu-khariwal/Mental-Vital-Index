"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TextInputProps {
  onSubmit: (text: string) => void
  minWords?: number
}

export function TextInput({ onSubmit, minWords = 50 }: TextInputProps) {
  const [text, setText] = useState("")

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const canSubmit = wordCount >= minWords

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(text)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share how you're feeling today. What's on your mind? Take your time and express yourself naturally..."
          className="min-h-[200px] resize-none"
        />
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            {wordCount} / {minWords} words {canSubmit ? "✓" : ""}
          </span>
          {!canSubmit && (
            <span className="text-muted-foreground">Write at least {minWords - wordCount} more words</span>
          )}
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={!canSubmit} size="lg" className="w-full">
        Analyze My Response
      </Button>
    </div>
  )
}
