import { useEffect, useState } from 'react'
'use client'
import { isAdminDomain } from '@/lib/utils/hostname'
import { supabase } from '@/lib/supabase/client'

type Props = {
  children: React.ReactNode
}

export default function AdminDomainGate({ children }: Props) {
  const [isAdminHost, setIsAdminHost] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminActive, setIsAdminActive] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setIsAdminHost(isAdminDomain())
  }, [])

  useEffect(() => {
    if (isAdminHost !== true) return
    ;(async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData || !userData.user) {
        setIsLoggedIn(false)
        setAuthChecked(true)
        return
      }
      setIsLoggedIn(true)
      const { data, error } = await supabase
        .from('system_admins')
        .select('is_active')
        .eq('id', userData.user.id)
        .maybeSingle()
      if (error) {
        setIsAdminActive(false)
      } else {
        const active = (data as any)?.is_active === true
        setIsAdminActive(active)
      }
      setAuthChecked(true)
    })()
  }, [isAdminHost])

  const requestLoginLink = async () => {
    setMessage(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      })
      if (error) {
        setMessage('Login request failed')
      } else {
        setMessage('Check your email for a login link')
      }
    } finally {
      setLoading(false)
    }
  }

  if (isAdminHost === null) {
    return null
  }

  if (isAdminHost === false) {
    return <>{children}</>
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="bg-white rounded-lg p-6 shadow-sm"
          style={{ border: '1px solid #e5e7eb' }}
        >
          <p style={{ color: '#0B1F33' }}>Loading</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="bg-white rounded-lg p-6 w-full max-w-sm"
          style={{ border: '1px solid #e5e7eb' }}
        >
          <h1 className="text-xl font-semibold mb-4" style={{ color: '#0B1F33' }}>
            Login required
          </h1>
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border rounded-lg px-3 py-2"
              style={{ borderColor: '#e5e7eb' }}
            />
            <button
              onClick={requestLoginLink}
              disabled={loading || !email}
              className="w-full text-white rounded-lg px-3 py-2"
              style={{ backgroundColor: '#0B1F33' }}
            >
              {loading ? 'Sending' : 'Request login link'}
            </button>
            {message && (
              <p className="text-sm" style={{ color: '#0B1F33' }}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isAdminActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="bg-white rounded-lg p-6 shadow-sm"
          style={{ border: '1px solid #e5e7eb' }}
        >
          <h1 className="text-xl font-semibold" style={{ color: '#0B1F33' }}>
            Access restricted
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-6 shadow-sm"
        style={{ border: '1px solid #e5e7eb' }}
      >
        <h1 className="text-xl font-semibold" style={{ color: '#0B1F33' }}>
          Admin access granted
        </h1>
      </div>
    </div>
  )
}
