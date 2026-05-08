-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mvi_assessments table to store all MVI evaluations
CREATE TABLE IF NOT EXISTS public.mvi_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Input data
  input_type TEXT NOT NULL CHECK (input_type IN ('voice', 'text')),
  transcript TEXT,
  audio_duration_seconds INTEGER,
  
  -- Audio analysis signals (0-100 scale)
  speech_rate_score DECIMAL(5,2),
  pause_pattern_score DECIMAL(5,2),
  tone_variation_score DECIMAL(5,2),
  voice_energy_score DECIMAL(5,2),
  
  -- Content analysis signals (0-100 scale)
  sentiment_score DECIMAL(5,2),
  stress_indicators_score DECIMAL(5,2),
  coherence_score DECIMAL(5,2),
  emotional_range_score DECIMAL(5,2),
  
  -- Final MVI score and interpretation
  mvi_score DECIMAL(5,2) NOT NULL,
  mvi_category TEXT NOT NULL CHECK (mvi_category IN ('critical', 'concerning', 'moderate', 'good', 'excellent')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_mvi_score CHECK (mvi_score >= 0 AND mvi_score <= 100)
);

-- Create recommendations table for personalized interventions
CREATE TABLE IF NOT EXISTS public.mvi_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.mvi_assessments(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('breathing', 'sleep', 'activity', 'social', 'professional')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mvi_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mvi_recommendations ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- MVI Assessments RLS policies
CREATE POLICY "Users can view their own assessments" 
  ON public.mvi_assessments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" 
  ON public.mvi_assessments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Recommendations RLS policies
CREATE POLICY "Users can view recommendations for their assessments" 
  ON public.mvi_recommendations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.mvi_assessments 
      WHERE mvi_assessments.id = mvi_recommendations.assessment_id 
      AND mvi_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can insert recommendations" 
  ON public.mvi_recommendations FOR INSERT 
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_mvi_assessments_user_id ON public.mvi_assessments(user_id);
CREATE INDEX idx_mvi_assessments_created_at ON public.mvi_assessments(created_at DESC);
CREATE INDEX idx_mvi_recommendations_assessment_id ON public.mvi_recommendations(assessment_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
