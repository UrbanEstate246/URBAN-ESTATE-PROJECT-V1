'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import { ShieldCheck, Phone, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [identifier, setIdentifier] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOtpSent(true)
      setMessage(
        authMethod === 'phone'
          ? `One-time code sent to ${identifier}`
          : `Magic link sent to ${identifier}`
      )
    }, 800)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setMessage('Successfully authenticated. Redirecting...')
      window.location.href = '/properties'
    }, 800)
  }

  return (
    <div className="py-16 md:py-24 bg-institutional-white min-h-[calc(100vh-160px)] flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto bg-white border border-subtle-border rounded-xl p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-verification-green/10 text-verification-green text-xs font-semibold rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Kenya Sign-In
            </div>
            <h1 className="text-2xl font-bold text-deep-charcoal mb-1">Welcome Back</h1>
            <p className="text-xs text-gray-500">
              Sign in to manage your listings, saved properties, and verification status.
            </p>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex bg-institutional-white p-1 rounded-lg border border-subtle-border mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone')
                setOtpSent(false)
                setMessage(null)
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'phone'
                  ? 'bg-civic-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-deep-charcoal'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email')
                setOtpSent(false)
                setMessage(null)
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'email'
                  ? 'bg-civic-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-deep-charcoal'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Link
            </button>
          </div>

          {/* Form */}
          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {authMethod === 'phone' ? 'Phone Number (Kenya)' : 'Email Address'}
                </label>
                <input
                  required
                  type={authMethod === 'phone' ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={authMethod === 'phone' ? '0712 345 678' : 'you@example.com'}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" isLoading={loading}>
                Send Verification Code
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Enter 6-Digit Code
                </label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 text-center tracking-widest text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" isLoading={loading}>
                Verify & Sign In
              </Button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-civic-blue pt-2"
              >
                Change {authMethod === 'phone' ? 'phone number' : 'email'}
              </button>
            </form>
          )}

          {message && (
            <p className="mt-4 text-center text-xs text-verification-green font-medium">
              {message}
            </p>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-subtle-border text-center text-xs text-gray-600">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-semibold text-civic-blue hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
