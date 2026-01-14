import { Database } from './database' 

export type User = Database['public']['Tables']['users']['Row'] 
export type UserInsert = Database['public']['Tables']['users']['Insert'] 
export type UserUpdate = Database['public']['Tables']['users']['Update'] 

export type UserRole = 'tenant' | 'landlord' | 'agent' | 'admin' | 'developer' | 'property_manager' 
export type UserStatus = 'active' | 'suspended' | 'deleted' 

export interface UserProfile extends User { 
  email?: string 
} 

