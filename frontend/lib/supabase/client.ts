import { createClientComponentClient } from '@supabase/auth-helpers-nextjs' 
import { Database } from '../types/database' 

// Browser client for use in Client Components 
export const createClient = () => { 
  return createClientComponentClient<Database>() 
} 

// Singleton instance for convenience 
export const supabase = createClient() 

