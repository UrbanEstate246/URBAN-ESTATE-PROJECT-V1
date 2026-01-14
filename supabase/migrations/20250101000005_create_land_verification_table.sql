-- Create land verification table 
CREATE TABLE public.land_verification ( 
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE, 
  parcel_number VARCHAR(100), 
  verification_source VARCHAR(20) CHECK (verification_source IN ('manual', 'third_party', 'gok')), 
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed')), 
  verified_at TIMESTAMP WITH TIME ZONE, 
  verified_by UUID REFERENCES public.users(id), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

CREATE INDEX idx_land_verification_property ON public.land_verification(property_id); 

ALTER TABLE public.land_verification ENABLE ROW LEVEL SECURITY; 

-- Only property owners and admins can view land verification 
CREATE POLICY "Owners can view land verification" ON public.land_verification 
  FOR SELECT USING ( 
    EXISTS ( 
      SELECT 1 FROM public.properties 
      WHERE id = land_verification.property_id 
      AND owner_id = auth.uid() 
    ) 
  ); 

