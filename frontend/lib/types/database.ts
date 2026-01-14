// Database types matching Supabase schema 
export type Json = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: Json | undefined } 
  | Json[] 

export interface Database { 
  public: { 
    Tables: { 
      users: { 
        Row: { 
          id: string 
          phone: string | null 
          role: 'tenant' | 'landlord' | 'agent' | 'admin' | 'developer' | 'property_manager' 
          verification_level: number 
          trust_score: number 
          status: 'active' | 'suspended' | 'deleted' 
          created_at: string 
          updated_at: string 
        } 
        Insert: { 
          id: string 
          phone?: string | null 
          role?: 'tenant' | 'landlord' | 'agent' | 'admin' | 'developer' | 'property_manager' 
          verification_level?: number 
          trust_score?: number 
          status?: 'active' | 'suspended' | 'deleted' 
          created_at?: string 
          updated_at?: string 
        } 
        Update: { 
          id?: string 
          phone?: string | null 
          role?: 'tenant' | 'landlord' | 'agent' | 'admin' | 'developer' | 'property_manager' 
          verification_level?: number 
          trust_score?: number 
          status?: 'active' | 'suspended' | 'deleted' 
          created_at?: string 
          updated_at?: string 
        } 
      } 
      properties: { 
        Row: { 
          id: string 
          owner_id: string 
          category: 'rent' | 'sale' | 'land' 
          type: string 
          status: 'active' | 'pending' | 'hidden' | 'suspended' | 'deleted' 
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected' 
          sponsored: boolean 
          title: string 
          description: string | null 
          price: number 
          county: string 
          area: string | null 
          ward: string | null 
          gps_lat: number | null 
          gps_lng: number | null 
          bedrooms: number | null 
          bathrooms: number | null 
          amenities: Json 
          views: number 
          inquiries: number 
          created_at: string 
          updated_at: string 
        } 
        Insert: { 
          id?: string 
          owner_id: string 
          category: 'rent' | 'sale' | 'land' 
          type: string 
          status?: 'active' | 'pending' | 'hidden' | 'suspended' | 'deleted' 
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected' 
          sponsored?: boolean 
          title: string 
          description?: string | null 
          price: number 
          county: string 
          area?: string | null 
          ward?: string | null 
          gps_lat?: number | null 
          gps_lng?: number | null 
          bedrooms?: number | null 
          bathrooms?: number | null 
          amenities?: Json 
          views?: number 
          inquiries?: number 
          created_at?: string 
          updated_at?: string 
        } 
        Update: { 
          id?: string 
          owner_id?: string 
          category?: 'rent' | 'sale' | 'land' 
          type?: string 
          status?: 'active' | 'pending' | 'hidden' | 'suspended' | 'deleted' 
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected' 
          sponsored?: boolean 
          title?: string 
          description?: string | null 
          price?: number 
          county?: string 
          area?: string | null 
          ward?: string | null 
          gps_lat?: number | null 
          gps_lng?: number | null 
          bedrooms?: number | null 
          bathrooms?: number | null 
          amenities?: Json 
          views?: number 
          inquiries?: number 
          created_at?: string 
          updated_at?: string 
        } 
      } 
      property_images: { 
        Row: { 
          id: string 
          property_id: string 
          cloudinary_public_id: string 
          cloudinary_url: string 
          thumbnail_url: string | null 
          display_order: number 
          uploaded_at: string 
        } 
        Insert: { 
          id?: string 
          property_id: string 
          cloudinary_public_id: string 
          cloudinary_url: string 
          thumbnail_url?: string | null 
          display_order?: number 
          uploaded_at?: string 
        } 
        Update: { 
          id?: string 
          property_id?: string 
          cloudinary_public_id?: string 
          cloudinary_url?: string 
          thumbnail_url?: string | null 
          display_order?: number 
          uploaded_at?: string 
        } 
      } 
      units: { 
        Row: { 
          id: string 
          property_id: string 
          unit_number: string 
          rent: number | null 
          status: 'vacant' | 'occupied' | 'maintenance' 
          tenant_id: string | null 
          created_at: string 
          updated_at: string 
        } 
        Insert: { 
          id?: string 
          property_id: string 
          unit_number: string 
          rent?: number | null 
          status?: 'vacant' | 'occupied' | 'maintenance' 
          tenant_id?: string | null 
          created_at?: string 
          updated_at?: string 
        } 
        Update: { 
          id?: string 
          property_id?: string 
          unit_number?: string 
          rent?: number | null 
          status?: 'vacant' | 'occupied' | 'maintenance' 
          tenant_id?: string | null 
          created_at?: string 
          updated_at?: string 
        } 
      } 
      land_verification: { 
        Row: { 
          id: string 
          property_id: string 
          parcel_number: string | null 
          verification_source: 'manual' | 'third_party' | 'gok' 
          verification_status: 'pending' | 'verified' | 'failed' 
          verified_at: string | null 
          verified_by: string | null 
          created_at: string 
        } 
        Insert: { 
          id?: string 
          property_id: string 
          parcel_number?: string | null 
          verification_source: 'manual' | 'third_party' | 'gok' 
          verification_status?: 'pending' | 'verified' | 'failed' 
          verified_at?: string | null 
          verified_by?: string | null 
          created_at?: string 
        } 
        Update: { 
          id?: string 
          property_id?: string 
          parcel_number?: string | null 
          verification_source?: 'manual' | 'third_party' | 'gok' 
          verification_status?: 'pending' | 'verified' | 'failed' 
          verified_at?: string | null 
          verified_by?: string | null 
          created_at?: string 
        } 
      } 
      audit_logs: { 
        Row: { 
          id: string 
          user_id: string | null 
          action: string 
          entity_type: string | null 
          entity_id: string | null 
          before_state: Json | null 
          after_state: Json | null 
          ip_address: string | null 
          user_agent: string | null 
          created_at: string 
        } 
        Insert: { 
          id?: string 
          user_id?: string | null 
          action: string 
          entity_type?: string | null 
          entity_id?: string | null 
          before_state?: Json | null 
          after_state?: Json | null 
          ip_address?: string | null 
          user_agent?: string | null 
          created_at?: string 
        } 
        Update: { 
          id?: string 
          user_id?: string | null 
          action?: string 
          entity_type?: string | null 
          entity_id?: string | null 
          before_state?: Json | null 
          after_state?: Json | null 
          ip_address?: string | null 
          user_agent?: string | null 
          created_at?: string 
        } 
      } 
    } 
  } 
} 

