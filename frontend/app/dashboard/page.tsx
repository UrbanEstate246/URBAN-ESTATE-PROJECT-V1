'use client'

import React from 'react'
import Link from 'next/link'
import { SAMPLE_PROPERTIES } from '@/lib/data/sampleProperties'
import { formatPrice } from '@/lib/utils/formatters'
import VerificationBadge from '@/components/property/VerificationBadge'
import Button from '@/components/ui/Button'
import {
  Building,
  Eye,
  MessageSquare,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react'

export default function DashboardOverviewPage() {
  const myProperties = SAMPLE_PROPERTIES.slice(0, 2)

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-deep-charcoal">
            Landlord Overview
          </h1>
          <p className="text-xs text-gray-500">
            Welcome back, Samuel. Manage your verified property listings and track tenant inquiries.
          </p>
        </div>

        <Link href="/list-property">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-subtle-border">
          <div className="w-9 h-9 rounded-lg bg-civic-blue/10 text-civic-blue flex items-center justify-center mb-3">
            <Building className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-deep-charcoal">2</span>
          <span className="block text-xs text-gray-500 mt-0.5">Active Properties</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-subtle-border">
          <div className="w-9 h-9 rounded-lg bg-authority-amber/15 text-authority-amber flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-deep-charcoal">1</span>
          <span className="block text-xs text-gray-500 mt-0.5">Pending Verification</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-subtle-border">
          <div className="w-9 h-9 rounded-lg bg-verification-green/10 text-verification-green flex items-center justify-center mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-deep-charcoal">862</span>
          <span className="block text-xs text-gray-500 mt-0.5">Total Property Views</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-subtle-border">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-deep-charcoal">42</span>
          <span className="block text-xs text-gray-500 mt-0.5">Direct Inquiries</span>
        </div>
      </div>

      {/* Trust Score Banner */}
      <div className="bg-white border border-subtle-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-verification-green/10 text-verification-green flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-deep-charcoal text-base">Trust Rating: 85 / 100</h3>
              <span className="text-xs px-2 py-0.5 bg-verification-green/10 text-verification-green font-semibold rounded-full">
                Tier 2 Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Phone number, national ID, and title documents confirmed. Verified listings receive priority ranking.
            </p>
          </div>
        </div>

        <Link href="/dashboard/settings">
          <Button variant="outline" size="sm">
            View Trust Details
          </Button>
        </Link>
      </div>

      {/* Recent Listings */}
      <div className="bg-white border border-subtle-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-deep-charcoal">My Active Listings</h2>
          <Link
            href="/dashboard/properties"
            className="text-xs font-semibold text-civic-blue hover:underline flex items-center gap-1"
          >
            Manage All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-subtle-border">
          {myProperties.map((prop) => (
            <div key={prop.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-civic-blue">{prop.type}</span>
                  <VerificationBadge status={prop.verification_status} />
                </div>
                <h4 className="font-semibold text-deep-charcoal text-sm">{prop.title}</h4>
                <span className="text-xs text-gray-500">{prop.area}, {prop.county}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-right">
                  <span className="font-bold text-deep-charcoal text-sm">{formatPrice(prop.price)}</span>
                  <span className="block text-[11px] text-gray-400">{prop.views} views • {prop.inquiries} inquiries</span>
                </div>

                <Link href={`/properties/${prop.id}`}>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
