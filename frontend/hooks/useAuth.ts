'use client'

import { useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { useSupabase } from './useSupabase'

export function useAuth() {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (mounted) {
          setSession(data.session)
          setUser(data.session?.user ?? null)
        }
      } catch (err) {
        console.error('Error fetching auth session:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signInWithOtp = useCallback(
    async (phone: string): Promise<{ error: AuthError | null }> => {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
        })
        return { error }
      } catch (err) {
        return { error: err as AuthError }
      }
    },
    [supabase]
  )

  const verifyOtp = useCallback(
    async (
      phone: string,
      token: string
    ): Promise<{ error: AuthError | null; session: Session | null }> => {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone,
          token,
          type: 'sms',
        })
        return { error, session: data.session }
      } catch (err) {
        return { error: err as AuthError, session: null }
      }
    },
    [supabase]
  )

  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      return { error: err as AuthError }
    }
  }, [supabase])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signInWithOtp,
    verifyOtp,
    signOut,
  }
}
