'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import FeatureToggle, { FeatureFlag } from '@/components/admin/FeatureToggle'
import { Sliders, ShieldCheck, Check } from 'lucide-react'

export default function AdminSettingsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: 'phone_otp',
      name: 'Phone OTP Authentication',
      description: 'Require SMS OTP for user sign-in and landlord registration via Africa’s Talking.',
      enabled: true,
      category: 'security',
    },
    {
      id: 'cloudinary_upload',
      name: 'Direct Cloudinary Media Uploads',
      description: 'Allow clients to directly upload property images to Cloudinary CDN.',
      enabled: true,
      category: 'storage',
    },
    {
      id: 'ardhisasa_check',
      name: 'Automated Title Search Integration',
      description: 'Automatically cross-reference parcel numbers with Ministry of Lands records.',
      enabled: false,
      category: 'security',
    },
    {
      id: 'public_listing',
      name: 'Public Self-Listing Flow',
      description: 'Allow any authenticated user to submit a property for verification review.',
      enabled: true,
      category: 'core',
    },
    {
      id: 'strict_rls',
      name: 'Enforce Strict Row-Level Security',
      description: 'Supabase PostgreSQL RLS active on properties, units, and audit tables.',
      enabled: true,
      category: 'security',
    },
  ])

  const [saved, setSaved] = useState(false)

  const handleToggle = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-institutional-white">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-blue/10 text-civic-blue text-xs font-semibold rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Golden Rule 2: Everything Must Be Toggleable
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-deep-charcoal">
              System Feature Flags
            </h1>
            <p className="text-xs text-gray-500">
              Control runtime behavior and toggle platform capabilities without code redeployments.
            </p>
          </div>

          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-verification-green/10 text-verification-green rounded-lg">
              <Check className="w-3.5 h-3.5" /> Feature flag state updated
            </span>
          )}
        </div>

        <FeatureToggle flags={flags} onToggle={handleToggle} />
      </main>
    </div>
  )
}
