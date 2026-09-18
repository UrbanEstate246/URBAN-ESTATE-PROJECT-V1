import { createClientComponentClient } from '@supabase/auth-helpers-nextjs' 
import { Database } from '../types/database' 

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Browser client for use in Client Components 
export const createClient = () => { 
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  }) 
} 

// Singleton instance for convenience 
export const supabase = createClient() 

