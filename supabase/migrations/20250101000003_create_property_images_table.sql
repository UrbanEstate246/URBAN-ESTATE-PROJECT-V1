-- Create property images table 
CREATE TABLE public.property_images ( 
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE, 
  cloudinary_public_id VARCHAR(255) NOT NULL, 
  cloudinary_url TEXT NOT NULL, 
  thumbnail_url TEXT, 
  display_order INTEGER DEFAULT 0, 
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

CREATE INDEX idx_property_images_property ON public.property_images(property_id); 

ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY; 

-- Public can view images of active properties 
CREATE POLICY "Public can view property images" ON public.property_images 
  FOR SELECT USING ( 
    EXISTS ( 
      SELECT 1 FROM public.properties 
      WHERE id = property_images.property_id 
      AND status = 'active' 
    ) 
  ); 

-- Property owners can manage images 
CREATE POLICY "Owners can manage property images" ON public.property_images 
  FOR ALL USING ( 
    EXISTS ( 
      SELECT 1 FROM public.properties 
      WHERE id = property_images.property_id 
      AND owner_id = auth.uid() 
    ) 
  ); 

