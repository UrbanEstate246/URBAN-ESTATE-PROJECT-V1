import { createServerComponentClient } from '@supabase/auth-helpers-nextjs' 
import { cookies } from 'next/headers' 
import { Database } from '../types/database' 

// Server client for use in Server Components and API routes 
export const createClient = () => { 
  return createServerComponentClient<Database>({ cookies }) 
} 

