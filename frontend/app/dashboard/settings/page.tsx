'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import { ShieldCheck, CheckCircle2, User, Award } from 'lucide-react'

export default function DashboardSettingsPage() {
  const [name, setName] = useState('Samuel Mwangi')
  const [phone] = useState('+254 712 345 678')
  const [email, setEmail] = useState('samuel.mwangi@example.com')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-deep-charcoal">Account & Trust Profile</h1>
        <p className="text-xs text-gray-500">
          Manage your personal information and check your verified landlord credentials.
        </p>
      </div>

      {/* Trust Score Breakdown Card */}
      <div className="bg-white border border-subtle-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-verification-green" />
          <h2 className="text-base font-bold text-deep-charcoal">Progressive Trust Score</h2>
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-extrabold text-civic-blue">85 / 100</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-verification-green/10 text-verification-green">
            High Integrity Standing
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
          <div className="bg-verification-green h-2 rounded-full w-[85%]" />
        </div>

        {/* Verification Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-institutional-white border border-subtle-border">
            <CheckCircle2 className="w-4 h-4 text-verification-green shrink-0" />
            <span>Kenyan Mobile Phone Verified (+10 pts)</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-institutional-white border border-subtle-border">
            <CheckCircle2 className="w-4 h-4 text-verification-green shrink-0" />
            <span>National ID / Passport Verified (+15 pts)</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-institutional-white border border-subtle-border">
            <CheckCircle2 className="w-4 h-4 text-verification-green shrink-0" />
            <span>2 Verified Properties Listed (+20 pts)</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-institutional-white border border-subtle-border">
            <CheckCircle2 className="w-4 h-4 text-verification-green shrink-0" />
            <span>Zero Confirmed Tenant Reports (+40 pts)</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-subtle-border rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-deep-charcoal mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-civic-blue" />
          Personal Details
        </h2>

        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Verified Phone Number
            </label>
            <input
              disabled
              type="text"
              value={phone}
              className="w-full px-4 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
            />
            <span className="text-[11px] text-verification-green font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Confirmed via OTP
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md">
              Save Changes
            </Button>
            {saved && (
              <span className="ml-3 text-xs text-verification-green font-semibold">
                Profile updated successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
