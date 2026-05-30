-- Create sync_logs table
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL,
  events_attempted INTEGER NOT NULL DEFAULT 0,
  events_succeeded INTEGER NOT NULL DEFAULT 0,
  events_failed INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sync logs" 
  ON public.sync_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sync logs" 
  ON public.sync_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
