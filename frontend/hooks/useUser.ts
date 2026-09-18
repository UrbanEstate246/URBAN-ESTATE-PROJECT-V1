'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useSupabase } from './useSupabase'
import { UserProfile, UserRole } from '@/lib/types/user'

export function useUser() {
  const { user: authUser, loading: authLoading } = useAuth()
  const { supabase } = useSupabase()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!authUser) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (queryError) {
        // If user record doesn't exist yet, fallback to authUser meta
        const fallbackProfile: UserProfile = {
          id: authUser.id,
          phone: authUser.phone || '',
          email: authUser.email || '',
          full_name: (authUser.user_metadata?.full_name as string) || null,
          role: (authUser.user_metadata?.role as UserRole) || 'tenant',
          verification_level: 1,
          trust_score: 100,
          status: 'active',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProfile(fallbackProfile)
      } else {
        setProfile(data as UserProfile)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile')
    } finally {
      setLoading(false)
    }
  }, [authUser, supabase])

  useEffect(() => {
    if (!authLoading) {
      fetchProfile()
    }
  }, [authLoading, fetchProfile])

  const role = profile?.role || (authUser?.user_metadata?.role as UserRole) || 'tenant'
  const isAdmin = role === 'admin'
  const isLandlord = role === 'landlord' || role === 'property_manager' || role === 'developer'

  return {
    user: authUser,
    profile,
    role,
    isAdmin,
    isLandlord,
    loading: authLoading || loading,
    error,
    refreshProfile: fetchProfile,
  }
}
