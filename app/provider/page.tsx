import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientOverviewCard } from "@/components/patient-overview-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, AlertTriangle } from "lucide-react"

export default async function ProviderDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a provider
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "provider") {
    redirect("/dashboard")
  }

  // Get provider's patient access list
  const { data: patientAccess } = await supabase
    .from("provider_patient_access")
    .select("patient_id, notes")
    .eq("provider_id", user.id)

  const patientIds = patientAccess?.map((pa) => pa.patient_id) || []

  // Fetch patient profiles
  const { data: patients } = await supabase.from("profiles").select("id, full_name").in("id", patientIds)

  // Fetch all assessments for these patients
  const { data: allAssessments } = await supabase
    .from("mvi_assessments")
    .select("*")
    .in("user_id", patientIds)
    .order("created_at", { ascending: false })

  // Group assessments by patient
  const patientAssessments = new Map()
  allAssessments?.forEach((assessment) => {
    if (!patientAssessments.has(assessment.user_id)) {
      patientAssessments.set(assessment.user_id, [])
    }
    patientAssessments.get(assessment.user_id).push(assessment)
  })

  // Calculate statistics
  const totalPatients = patients?.length || 0
  const totalAssessments = allAssessments?.length || 0
  const criticalPatients =
    patients?.filter((p) => {
      const assessments = patientAssessments.get(p.id) || []
      const latest = assessments[0]
      return latest && (latest.mvi_category === "critical" || latest.mvi_category === "concerning")
    }).length || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <p className="text-muted-foreground">Monitor and support your patients' mental vitality</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Patients</CardDescription>
              <CardTitle className="text-4xl">{totalPatients}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">Active in care</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Assessments</CardDescription>
              <CardTitle className="text-4xl">{totalAssessments}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span className="text-sm">All time</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Require Attention</CardDescription>
              <CardTitle className="text-4xl">{criticalPatients}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Critical/Concerning</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Patient Overview</h2>
          {patients && patients.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patients.map((patient) => (
                <PatientOverviewCard
                  key={patient.id}
                  patientId={patient.id}
                  patientName={patient.full_name || "Patient"}
                  assessments={patientAssessments.get(patient.id) || []}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Patients Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Patients will appear here once they grant you access to their mental vitality data.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
