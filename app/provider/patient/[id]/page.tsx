import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientTrendComparison } from "@/components/patient-trend-comparison"
import { AssessmentHistory } from "@/components/assessment-history"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Verify provider has access to this patient
  const { data: access } = await supabase
    .from("provider_patient_access")
    .select("*")
    .eq("provider_id", user.id)
    .eq("patient_id", id)
    .single()

  if (!access) {
    redirect("/provider")
  }

  // Fetch patient profile
  const { data: patient } = await supabase.from("profiles").select("*").eq("id", id).single()

  // Fetch patient assessments
  const { data: assessments } = await supabase
    .from("mvi_assessments")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })

  // Fetch intervention notes
  const { data: notes } = await supabase
    .from("intervention_notes")
    .select("*")
    .eq("patient_id", id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/provider" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/provider/patient/${id}/notes`} className="gap-2">
              <FileText className="w-4 h-4" />
              Add Clinical Note
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{patient?.full_name || "Patient"}</h1>
          <p className="text-muted-foreground">Comprehensive mental vitality tracking and analysis</p>
        </div>

        {assessments && assessments.length > 1 && (
          <PatientTrendComparison patientName={patient?.full_name || "Patient"} assessments={assessments} />
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Assessment History</h2>
            {assessments && assessments.length > 0 ? (
              <AssessmentHistory assessments={assessments} />
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No assessments available yet.
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Clinical Notes</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intervention Notes</CardTitle>
                <CardDescription>Your clinical observations and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {notes && notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="border-l-2 border-primary pl-4 py-2">
                        <div className="text-sm text-muted-foreground mb-1">
                          {new Date(note.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <p className="text-sm">{note.note_text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No clinical notes yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
