-- Create units table (for apartment buildings) 
CREATE TABLE public.units ( 
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE, 
  unit_number VARCHAR(50), 
  rent DECIMAL(10,2), 
  status VARCHAR(20) DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance')), 
  tenant_id UUID REFERENCES public.users(id) ON DELETE SET NULL, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

CREATE INDEX idx_units_property ON public.units(property_id); 
CREATE INDEX idx_units_tenant ON public.units(tenant_id); 

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY; 

-- Property owners can manage units 
CREATE POLICY "Owners can manage units" ON public.units 
  FOR ALL USING ( 
    EXISTS ( 
      SELECT 1 FROM public.properties 
      WHERE id = units.property_id 
      AND owner_id = auth.uid() 
    ) 
  ); 

-- Updated_at trigger 
CREATE TRIGGER update_units_updated_at 
  BEFORE UPDATE ON public.units 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 

