-- UrbanEstate Seed Data
-- Realistic Kenyan properties and sample locations for local and cloud testing

-- Insert sample properties
INSERT INTO public.properties (
  id,
  category,
  type,
  status,
  verification_status,
  sponsored,
  title,
  description,
  price,
  county,
  area,
  ward,
  bedrooms,
  bathrooms,
  amenities,
  views,
  inquiries
) VALUES 
(
  'a1010000-0000-0000-0000-000000000101',
  'rent',
  'Apartment',
  'active',
  'verified',
  true,
  'Modern 2 Bedroom Apartment in Kilimani',
  'Spacious and sunlit modern 2 bedroom master en-suite apartment situated in the heart of Kilimani. Features borehole water, backup generator, high-speed elevator, and 24/7 manned security.',
  65000.00,
  'Nairobi',
  'Kilimani',
  'Kilimani',
  2,
  2,
  '["Parking", "Security", "Water", "Backup Power", "CCTV", "Elevator", "WiFi"]'::jsonb,
  342,
  18
),
(
  'a1020000-0000-0000-0000-000000000102',
  'sale',
  'House',
  'active',
  'verified',
  false,
  '4 Bedroom Townhouse with Private Garden',
  'Immaculately finished 4 bedroom all en-suite townhouse in a gated community in Lavington. Includes DSQ, private landscaped garden, solar water heating, and borehole supply.',
  34000000.00,
  'Nairobi',
  'Lavington',
  'Lavington',
  4,
  4,
  '["Parking", "Security", "Water", "Garden", "CCTV", "Borehole", "Balcony"]'::jsonb,
  520,
  24
),
(
  'a1030000-0000-0000-0000-000000000103',
  'rent',
  'Apartment',
  'active',
  'verified',
  false,
  'Executive 1 Bedroom in Westlands with Gym & Pool',
  'Luxurious furnished 1 bedroom apartment located along Rhapta Road, Westlands. Comes with rooftop heated pool, fully equipped gym, clubhouse, and biometric access.',
  75000.00,
  'Nairobi',
  'Westlands',
  'Parklands/Highridge',
  1,
  1,
  '["Gym", "Swimming Pool", "Security", "Elevator", "Furnished", "WiFi", "Backup Power"]'::jsonb,
  410,
  31
),
(
  'a1040000-0000-0000-0000-000000000104',
  'rent',
  'Apartment',
  'pending',
  'unverified',
  false,
  'Affordable 2 Bedroom in Ruaka near Two Rivers Mall',
  'Spacious 2 bedroom apartment in Ruaka with private balcony, fitted kitchen cabinets, token electricity, and ample secure parking.',
  32000.00,
  'Kiambu',
  'Ruaka',
  'Karuri',
  2,
  1,
  '["Parking", "Security", "Water", "Balcony"]'::jsonb,
  180,
  9
),
(
  'a1050000-0000-0000-0000-000000000105',
  'land',
  'Land',
  'active',
  'verified',
  true,
  'Prime 1/4 Acre Residential Plot in Ruiru',
  'Gated community serviced plot in Ruiru with ready title deed. Red soil, electricity, and county council water readily available on site. Ideal for immediate development.',
  4800000.00,
  'Kiambu',
  'Ruiru',
  'Biashara',
  NULL,
  NULL,
  '["Water", "Electricity", "Security"]'::jsonb,
  290,
  14
),
(
  'a1060000-0000-0000-0000-000000000106',
  'sale',
  'Villa',
  'active',
  'verified',
  false,
  '3 Bedroom Beachside Villa in Nyali',
  'Magnificent coastal villa featuring ocean views, private swimming pool, landscaped tropical garden, and coral perimeter wall with electric fence.',
  26500000.00,
  'Mombasa',
  'Nyali',
  'Kongowea',
  3,
  3,
  '["Swimming Pool", "Garden", "Security", "CCTV", "Parking", "Borehole", "Balcony"]'::jsonb,
  640,
  38
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample property images
INSERT INTO public.property_images (
  id,
  property_id,
  cloudinary_public_id,
  cloudinary_url,
  thumbnail_url,
  display_order
) VALUES
(
  'b1010000-0000-0000-0000-000000000101',
  'a1010000-0000-0000-0000-000000000101',
  'urbanestate/kilimani-1',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
  1
),
(
  'b1010000-0000-0000-0000-000000000102',
  'a1010000-0000-0000-0000-000000000101',
  'urbanestate/kilimani-2',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
  2
),
(
  'b1020000-0000-0000-0000-000000000101',
  'a1020000-0000-0000-0000-000000000102',
  'urbanestate/lavington-1',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
  1
),
(
  'b1030000-0000-0000-0000-000000000101',
  'a1030000-0000-0000-0000-000000000103',
  'urbanestate/westlands-1',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80',
  1
),
(
  'b1040000-0000-0000-0000-000000000101',
  'a1040000-0000-0000-0000-000000000104',
  'urbanestate/ruaka-1',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
  1
),
(
  'b1050000-0000-0000-0000-000000000101',
  'a1050000-0000-0000-0000-000000000105',
  'urbanestate/ruiru-1',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
  1
),
(
  'b1060000-0000-0000-0000-000000000101',
  'a1060000-0000-0000-0000-000000000106',
  'urbanestate/nyali-1',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80',
  1
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample building units
INSERT INTO public.units (
  id,
  property_id,
  unit_number,
  rent,
  status
) VALUES
(
  'c1010000-0000-0000-0000-000000000101',
  'a1010000-0000-0000-0000-000000000101',
  'A-402',
  65000.00,
  'vacant'
),
(
  'c1010000-0000-0000-0000-000000000102',
  'a1010000-0000-0000-0000-000000000101',
  'B-101',
  65000.00,
  'occupied'
),
(
  'c1030000-0000-0000-0000-000000000101',
  'a1030000-0000-0000-0000-000000000103',
  'Penthouse 8',
  75000.00,
  'vacant'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample land verification registry record
INSERT INTO public.land_verification (
  id,
  property_id,
  parcel_number,
  verification_source,
  verification_status,
  verified_at
) VALUES
(
  'd1050000-0000-0000-0000-000000000101',
  'a1050000-0000-0000-0000-000000000105',
  'RUIRU/BLOCK-4/912',
  'gok',
  'verified',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

