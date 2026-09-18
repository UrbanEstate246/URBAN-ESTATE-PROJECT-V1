-- Migration: 20250101000007_enable_rls_policies.sql
-- Purpose: Create system_admins table and consolidate Row-Level Security policies

-- 1. Create system_admins table for admin domain gate and RBAC
CREATE TABLE IF NOT EXISTS public.system_admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on system_admins
ALTER TABLE public.system_admins ENABLE ROW LEVEL SECURITY;

-- Admins can read their own status
CREATE POLICY "System admins can view own admin status" ON public.system_admins
  FOR SELECT USING (auth.uid() = id);

-- Service role has full access
CREATE POLICY "Service role has full access to system_admins" ON public.system_admins
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 2. Consolidated Property Policies
-- Ensure RLS is active on all core tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow system admins to view all properties regardless of status
CREATE POLICY "System admins can view all properties" ON public.properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.system_admins 
      WHERE system_admins.id = auth.uid() AND system_admins.is_active = true
    )
  );

-- Allow system admins to update verification and listing status
CREATE POLICY "System admins can update properties" ON public.properties
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.system_admins 
      WHERE system_admins.id = auth.uid() AND system_admins.is_active = true
    )
  );

-- Allow system admins to view all land verification records
CREATE POLICY "System admins can view land verification" ON public.land_verification
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.system_admins 
      WHERE system_admins.id = auth.uid() AND system_admins.is_active = true
    )
  );
