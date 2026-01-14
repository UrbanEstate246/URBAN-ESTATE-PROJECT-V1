-- Create audit logs table 
CREATE TABLE public.audit_logs ( 
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  user_id UUID REFERENCES public.users(id), 
  action VARCHAR(100) NOT NULL, 
  entity_type VARCHAR(50), 
  entity_id UUID, 
  before_state JSONB, 
  after_state JSONB, 
  ip_address INET, 
  user_agent TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id); 
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC); 
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action); 

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY; 

-- Only service role can access audit logs 
CREATE POLICY "Service role can access audit logs" ON public.audit_logs 
  FOR ALL USING (auth.jwt()->>'role' = 'service_role'); 

