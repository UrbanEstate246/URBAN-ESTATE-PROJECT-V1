import { createServerComponentClient } from '@supabase/auth-helpers-nextjs' 
import { cookies } from 'next/headers' 
import { Database } from '../types/database' 

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Server client for use in Server Components and API routes 
export const createClient = () => { 
  return createServerComponentClient<Database>(
    { cookies },
    {
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
    }
  ) 
} 

