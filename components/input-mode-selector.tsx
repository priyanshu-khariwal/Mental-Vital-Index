"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoiceRecorder } from "./voice-recorder"
import { TextInput } from "./text-input"
import { Mic, MessageSquare } from "lucide-react"

interface InputModeSelectorProps {
  onVoiceSubmit: (audioBlob: Blob, duration: number) => void
  onTextSubmit: (text: string) => void
}

export function InputModeSelector({ onVoiceSubmit, onTextSubmit }: InputModeSelectorProps) {
  const [activeTab, setActiveTab] = useState<"voice" | "text">("voice")

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 shadow-2xl">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-3xl">Mental Vital Check-In</CardTitle>
        <CardDescription className="text-lg leading-relaxed">
          Share how you're feeling today through voice or text. Your responses help us understand your mental vitality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "voice" | "text")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 h-auto bg-muted/50">
            <TabsTrigger value="voice" className="gap-2 py-3 text-base data-[state=active]:shadow-md">
              <Mic className="w-5 h-5" />
              Voice Recording
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2 py-3 text-base data-[state=active]:shadow-md">
              <MessageSquare className="w-5 h-5" />
              Text Response
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="mt-0">
            <VoiceRecorder onRecordingComplete={onVoiceSubmit} minDuration={30} maxDuration={60} />
          </TabsContent>

          <TabsContent value="text" className="mt-0">
            <TextInput onSubmit={onTextSubmit} minWords={50} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
