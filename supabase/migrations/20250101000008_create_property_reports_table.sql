-- Migration 8: Create property_reports table and auto-quarantine trigger for community signals
CREATE TABLE public.property_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('incorrect_details', 'duplicate', 'scam_pricing', 'unauthorized_listing', 'already_leased', 'other')),
  details TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_property_reporter UNIQUE (property_id, reporter_id)
);

CREATE INDEX idx_reports_property ON public.property_reports(property_id);
CREATE INDEX idx_reports_reporter ON public.property_reports(reporter_id);
CREATE INDEX idx_reports_status ON public.property_reports(status);

-- Enable RLS
ALTER TABLE public.property_reports ENABLE ROW LEVEL SECURITY;

-- Authenticated users can submit a report
CREATE POLICY "Users can report properties" ON public.property_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own submitted reports
CREATE POLICY "Users can view own reports" ON public.property_reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- System admins have full management access
CREATE POLICY "System admins can manage property reports" ON public.property_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.system_admins
      WHERE user_id = auth.uid()
    )
  );

-- Function to auto-quarantine listing if threshold reached (3+ community reports)
CREATE OR REPLACE FUNCTION handle_property_report_threshold()
RETURNS TRIGGER AS $$
DECLARE
  report_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO report_count
  FROM public.property_reports
  WHERE property_id = NEW.property_id AND status = 'pending';

  IF report_count >= 3 THEN
    -- Auto-hide the listing to protect users
    UPDATE public.properties
    SET status = 'hidden'
    WHERE id = NEW.property_id;

    -- Record in audit logs
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
      NEW.reporter_id,
      'auto_hide_reported_property',
      'property',
      NEW.property_id,
      jsonb_build_object('report_count', report_count, 'trigger_reason', NEW.reason)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_check_property_reports
  AFTER INSERT ON public.property_reports
  FOR EACH ROW
  EXECUTE FUNCTION handle_property_report_threshold();
