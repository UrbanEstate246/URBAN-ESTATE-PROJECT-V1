'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import { ShieldCheck, UserCheck, Building, KeyRound, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [role, setRole] = useState<'tenant' | 'landlord' | 'agent'>('tenant')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="py-16 md:py-24 bg-institutional-white min-h-[calc(100vh-160px)] flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto bg-white border border-subtle-border rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-verification-green/10 text-verification-green text-xs font-semibold rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Institutional Trust Platform
            </div>
            <h1 className="text-2xl font-bold text-deep-charcoal mb-1">Create an Account</h1>
            <p className="text-xs text-gray-500">
              Join Kenya&apos;s verified property marketplace. No hidden charges.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-verification-green/10 text-verification-green flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-deep-charcoal">Account Setup Initiated</h3>
              <p className="text-xs text-gray-600">
                We sent a verification SMS to <strong className="text-deep-charcoal">{phone}</strong>.
                Follow the link to complete your profile verification.
              </p>
              <Link href="/properties">
                <Button variant="primary" fullWidth size="md">
                  Explore Listings Now
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  I want to:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('tenant')}
                    className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all text-center ${
                      role === 'tenant'
                        ? 'bg-civic-blue text-white border-civic-blue'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Rent / Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('landlord')}
                    className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all text-center ${
                      role === 'landlord'
                        ? 'bg-civic-blue text-white border-civic-blue'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    List Property
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('agent')}
                    className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all text-center ${
                      role === 'agent'
                        ? 'bg-civic-blue text-white border-civic-blue'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Agent
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grace Wanjiku"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number (Kenya)
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="grace@example.com"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-subtle-border text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-civic-blue hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
