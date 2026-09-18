'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import PropertyReviewCard from '@/components/admin/PropertyReviewCard'
import { SAMPLE_PROPERTIES } from '@/lib/data/sampleProperties'
import { PropertyWithImages } from '@/lib/types/property'
import { ShieldCheck, CheckCircle2, Clock, XCircle, Search } from 'lucide-react'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertyWithImages[]>(SAMPLE_PROPERTIES)
  const [filterTab, setFilterTab] = useState<'pending' | 'verified' | 'all'>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showNotification = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleApprove = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              verification_status: 'verified',
              status: 'active',
              updated_at: new Date().toISOString(),
            }
          : p
      )
    )
    showNotification(`Property ${id} approved and marked as verified!`)
  }

  const handleReject = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              verification_status: 'rejected',
              status: 'suspended',
              updated_at: new Date().toISOString(),
            }
          : p
      )
    )
    showNotification(`Property ${id} rejected and unlisted.`)
  }

  // Counts
  const pendingCount = properties.filter((p) => p.verification_status !== 'verified').length
  const verifiedCount = properties.filter((p) => p.verification_status === 'verified').length
  const totalCount = properties.length

  // Filtered List
  const filteredProperties = properties.filter((p) => {
    if (filterTab === 'pending' && p.verification_status === 'verified') {
      return false
    }
    if (filterTab === 'verified' && p.verification_status !== 'verified') {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchCounty = p.county.toLowerCase().includes(q)
      const matchId = p.id.toLowerCase().includes(q)
      return matchTitle || matchCounty || matchId
    }
    return true
  })

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-institutional-white">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-blue/10 text-civic-blue text-xs font-semibold rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Listing Governance Desk
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-deep-charcoal">
              Property Verification Queue
            </h1>
            <p className="text-xs text-gray-500">
              Audit submitted title records, inspect photo authentications, and approve listings.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or title..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-subtle-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-authority-amber/15 text-authority-amber flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-deep-charcoal">{pendingCount}</span>
              <span className="block text-xs text-gray-500">Awaiting Audit</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-subtle-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-verification-green/10 text-verification-green flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-deep-charcoal">{verifiedCount}</span>
              <span className="block text-xs text-gray-500">Active Verified</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-subtle-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-civic-blue/10 text-civic-blue flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-deep-charcoal">{totalCount}</span>
              <span className="block text-xs text-gray-500">Total Records</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-subtle-border mb-6 gap-2">
          <button
            type="button"
            onClick={() => setFilterTab('pending')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              filterTab === 'pending'
                ? 'border-civic-blue text-civic-blue'
                : 'border-transparent text-gray-500 hover:text-deep-charcoal'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Needs Review ({pendingCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('verified')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              filterTab === 'verified'
                ? 'border-civic-blue text-civic-blue'
                : 'border-transparent text-gray-500 hover:text-deep-charcoal'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Listings ({verifiedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              filterTab === 'all'
                ? 'border-civic-blue text-civic-blue'
                : 'border-transparent text-gray-500 hover:text-deep-charcoal'
            }`}
          >
            All Listings ({totalCount})
          </button>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="mb-6 p-4 bg-civic-blue text-white text-xs font-medium rounded-lg flex items-center justify-between shadow-md">
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Listing Cards */}
        <div className="space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-16 bg-white border border-subtle-border rounded-xl">
              <CheckCircle2 className="w-10 h-10 text-verification-green mx-auto mb-3" />
              <h3 className="text-base font-bold text-deep-charcoal">Queue is clear</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                There are no properties matching this review criteria right now.
              </p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <PropertyReviewCard
                key={property.id}
                property={property}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
