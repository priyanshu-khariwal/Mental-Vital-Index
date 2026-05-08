-- Add provider role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'provider'));

-- Create provider_patient_access table for care relationships
CREATE TABLE IF NOT EXISTS public.provider_patient_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_granted_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(provider_id, patient_id)
);

-- Enable RLS on provider_patient_access
ALTER TABLE public.provider_patient_access ENABLE ROW LEVEL SECURITY;

-- Providers can view their patient access records
CREATE POLICY "Providers can view their patient access" 
  ON public.provider_patient_access FOR SELECT 
  USING (auth.uid() = provider_id);

-- Patients can view who has access to their data
CREATE POLICY "Patients can view their access records" 
  ON public.provider_patient_access FOR SELECT 
  USING (auth.uid() = patient_id);

-- Providers can view their patients' assessments
CREATE POLICY "Providers can view patient assessments" 
  ON public.mvi_assessments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_patient_access 
      WHERE provider_patient_access.provider_id = auth.uid() 
      AND provider_patient_access.patient_id = mvi_assessments.user_id
    )
  );

-- Providers can view their patients' profiles
CREATE POLICY "Providers can view patient profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_patient_access 
      WHERE provider_patient_access.provider_id = auth.uid() 
      AND provider_patient_access.patient_id = profiles.id
    )
  );

-- Create intervention_notes table for provider documentation
CREATE TABLE IF NOT EXISTS public.intervention_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.mvi_assessments(id) ON DELETE SET NULL,
  note_text TEXT NOT NULL,
  intervention_type TEXT CHECK (intervention_type IN ('observation', 'recommendation', 'referral', 'follow_up')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.intervention_notes ENABLE ROW LEVEL SECURITY;

-- Providers can manage their own notes
CREATE POLICY "Providers can manage their notes" 
  ON public.intervention_notes FOR ALL 
  USING (auth.uid() = provider_id);

-- Patients can view notes about them
CREATE POLICY "Patients can view their notes" 
  ON public.intervention_notes FOR SELECT 
  USING (auth.uid() = patient_id);

-- Create index for performance
CREATE INDEX idx_provider_patient_access_provider ON public.provider_patient_access(provider_id);
CREATE INDEX idx_provider_patient_access_patient ON public.provider_patient_access(patient_id);
CREATE INDEX idx_intervention_notes_provider ON public.intervention_notes(provider_id);
CREATE INDEX idx_intervention_notes_patient ON public.intervention_notes(patient_id);

-- Trigger for intervention_notes updated_at
CREATE TRIGGER update_intervention_notes_updated_at 
  BEFORE UPDATE ON public.intervention_notes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
