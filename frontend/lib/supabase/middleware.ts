import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs' 
import { NextResponse } from 'next/server' 
import type { NextRequest } from 'next/server' 
import { Database } from '../types/database' 

export async function middleware(req: NextRequest) { 
  const res = NextResponse.next() 
  const supabase = createMiddlewareClient<Database>({ req, res }) 

  // Refresh session if expired 
  await supabase.auth.getSession() 

  return res 
} 

// Specify which routes to run middleware on 
export const config = { 
  matcher: [ 
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)', 
  ], 
} 

