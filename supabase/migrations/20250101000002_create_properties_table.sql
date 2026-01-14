-- Create properties table 
CREATE TABLE public.properties ( 
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE, 
  category VARCHAR(20) CHECK (category IN ('rent', 'sale', 'land')), 
  type VARCHAR(50), 
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'hidden', 'suspended', 'deleted')), 
  verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')), 
  sponsored BOOLEAN DEFAULT false, 
  title VARCHAR(200) NOT NULL, 
  description TEXT, 
  price DECIMAL(12,2) NOT NULL, 
  county VARCHAR(100) NOT NULL, 
  area VARCHAR(100), 
  ward VARCHAR(100), 
  gps_lat DECIMAL(10,8), 
  gps_lng DECIMAL(11,8), 
  bedrooms INTEGER, 
  bathrooms INTEGER, 
  amenities JSONB DEFAULT '[]'::jsonb, 
  views INTEGER DEFAULT 0, 
  inquiries INTEGER DEFAULT 0, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

-- Indexes 
CREATE INDEX idx_properties_owner ON public.properties(owner_id); 
CREATE INDEX idx_properties_category ON public.properties(category); 
CREATE INDEX idx_properties_county ON public.properties(county); 
CREATE INDEX idx_properties_status ON public.properties(status); 
CREATE INDEX idx_properties_verification ON public.properties(verification_status); 
CREATE INDEX idx_properties_price ON public.properties(price); 

-- Enable RLS 
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY; 

-- Public can view active properties 
CREATE POLICY "Public can view active properties" ON public.properties 
  FOR SELECT USING (status = 'active'); 

-- Owners can view their own properties (any status) 
CREATE POLICY "Owners can view own properties" ON public.properties 
  FOR SELECT USING (auth.uid() = owner_id); 

-- Authenticated users can create properties 
CREATE POLICY "Authenticated users can create properties" ON public.properties 
  FOR INSERT WITH CHECK (auth.uid() = owner_id); 

-- Owners can update their own properties 
CREATE POLICY "Owners can update own properties" ON public.properties 
  FOR UPDATE USING (auth.uid() = owner_id); 

-- Owners can delete their own properties (soft delete) 
CREATE POLICY "Owners can delete own properties" ON public.properties 
  FOR DELETE USING (auth.uid() = owner_id); 

-- Updated_at trigger 
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON public.properties 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 

