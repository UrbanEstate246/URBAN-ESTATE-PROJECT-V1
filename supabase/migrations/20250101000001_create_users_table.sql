-- Create users table (extends auth.users) 
CREATE TABLE public.users ( 
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, 
  phone VARCHAR(15) UNIQUE, 
  role VARCHAR(20) DEFAULT 'tenant' CHECK (role IN ('tenant', 'landlord', 'agent', 'admin', 'developer', 'property_manager')), 
  verification_level INTEGER DEFAULT 0, 
  trust_score INTEGER DEFAULT 0, 
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

-- Enable Row Level Security 
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; 

-- Users can view their own data 
CREATE POLICY "Users can view own data" ON public.users 
  FOR SELECT USING (auth.uid() = id); 

-- Users can update their own data 
CREATE POLICY "Users can update own data" ON public.users 
  FOR UPDATE USING (auth.uid() = id); 

-- Trigger to keep updated_at current 
CREATE OR REPLACE FUNCTION update_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at = NOW(); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 

