// Kenyan Counties 
export const KENYAN_COUNTIES = [ 
  'Nairobi', 
  'Mombasa', 
  'Kwale', 
  'Kilifi', 
  'Tana River', 
  'Lamu', 
  'Taita-Taveta', 
  'Garissa', 
  'Wajir', 
  'Mandera', 
  'Marsabit', 
  'Isiolo', 
  'Meru', 
  'Tharaka-Nithi', 
  'Embu', 
  'Kitui', 
  'Machakos', 
  'Makueni', 
  'Nyandarua', 
  'Nyeri', 
  'Kirinyaga', 
  'Murang\'a', 
  'Kiambu', 
  'Turkana', 
  'West Pokot', 
  'Samburu', 
  'Trans-Nzoia', 
  'Uasin Gishu', 
  'Elgeyo-Marakwet', 
  'Nandi', 
  'Baringo', 
  'Laikipia', 
  'Nakuru', 
  'Narok', 
  'Kajiado', 
  'Kericho', 
  'Bomet', 
  'Kakamega', 
  'Vihiga', 
  'Bungoma', 
  'Busia', 
  'Siaya', 
  'Kisumu', 
  'Homa Bay', 
  'Migori', 
  'Kisii', 
  'Nyamira', 
] as const 

// Property Types 
export const PROPERTY_TYPES = { 
  rent: ['Bedsitter', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', '5+ Bedroom', 'Apartment', 'Villa', 'Commercial'], 
  sale: ['Apartment', 'House', 'Villa', 'Townhouse', 'Commercial'], 
  land: ['Residential', 'Agricultural', 'Commercial'], 
} as const 

// Amenities 
export const AMENITIES = [ 
  'Parking', 
  'Security', 
  'Water', 
  'Electricity', 
  'Backup Power', 
  'CCTV', 
  'Gym', 
  'Swimming Pool', 
  'Garden', 
  'Balcony', 
  'WiFi', 
  'Furnished', 
  'Elevator', 
  'Borehole', 
] as const 

// Rate Limits 
export const RATE_LIMITS = { 
  OTP_REQUESTS_PER_HOUR: 3, 
  PROPERTY_CREATION_PER_HOUR: 10, 
  API_REQUESTS_PER_MINUTE: 100, 
} as const 

// Upload Limits 
export const UPLOAD_LIMITS = { 
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB 
  MAX_IMAGES_PER_PROPERTY: 10, 
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'], 
} as const 

// Trust Score Weights 
export const TRUST_SCORE_WEIGHTS = { 
  PHONE_VERIFIED: 10, 
  GOOGLE_LINKED: 5, 
  ID_VERIFIED: 15, 
  PROPERTY_VERIFIED: 10, 
  ACCOUNT_AGE_PER_YEAR: 5, 
  SUCCESSFUL_TRANSACTION: 3, 
  FLAG: -20, 
  CONFIRMED_REPORT: -30, 
} as const 

