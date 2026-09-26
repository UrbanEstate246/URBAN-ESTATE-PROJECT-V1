import { createClient } from "@supabase/supabase-js";

// Credentials come from .env only — never hardcode keys here (the service role key bypasses RLS).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error(
        "Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY"
    );
}

const serverOptions = { auth: { persistSession: false, autoRefreshToken: false } };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, serverOptions);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, serverOptions);
