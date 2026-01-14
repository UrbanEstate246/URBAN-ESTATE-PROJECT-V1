import { Database } from './database' 

export type Property = Database['public']['Tables']['properties']['Row'] 
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'] 
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'] 

export type PropertyImage = Database['public']['Tables']['property_images']['Row'] 

export type PropertyCategory = 'rent' | 'sale' | 'land' 
export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial' | 'bedsitter' | '1br' | '2br' | '3br' | '4br' | '5br' 
export type PropertyStatus = 'active' | 'pending' | 'hidden' | 'suspended' | 'deleted' 
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' 

export interface PropertyWithImages extends Property { 
  property_images: PropertyImage[] 
} 

export interface PropertyFormData { 
  title: string 
  description: string 
  category: PropertyCategory 
  type: string 
  price: number 
  county: string 
  area: string 
  ward: string 
  gps_lat?: number 
  gps_lng?: number 
  bedrooms?: number 
  bathrooms?: number 
  amenities: string[] 
} 

