'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SAMPLE_PROPERTIES } from '@/lib/data/sampleProperties'
import { formatPrice } from '@/lib/utils/formatters'
import VerificationBadge from '@/components/property/VerificationBadge'
import Button from '@/components/ui/Button'
import { Plus, ExternalLink } from 'lucide-react'

export default function DashboardPropertiesPage() {
  const [properties, setProperties] = useState(SAMPLE_PROPERTIES)

  const toggleStatus = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === 'active' ? 'hidden' : 'active',
            }
          : p
      )
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-charcoal">My Properties</h1>
          <p className="text-xs text-gray-500">
            View, edit, and monitor verification status of all your listed estates.
          </p>
        </div>

        <Link href="/list-property">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Property
          </Button>
        </Link>
      </div>

      {/* Property Items */}
      <div className="space-y-4">
        {properties.map((prop) => {
          const img =
            prop.property_images && prop.property_images.length > 0
              ? prop.property_images[0].cloudinary_url
              : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'

          return (
            <div
              key={prop.id}
              className="bg-white border border-subtle-border rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              {/* Left Details */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image src={img} alt={prop.title} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-civic-blue">{prop.category.toUpperCase()}</span>
                    <VerificationBadge status={prop.verification_status} />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prop.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {prop.status === 'active' ? 'Public' : 'Hidden'}
                    </span>
                  </div>
                  <h3 className="font-bold text-deep-charcoal text-sm line-clamp-1">{prop.title}</h3>
                  <p className="text-xs text-gray-500">{prop.area}, {prop.county}</p>
                </div>
              </div>

              {/* Middle Metrics */}
              <div className="flex items-center gap-6 text-xs text-gray-600">
                <div className="text-center">
                  <span className="block font-bold text-deep-charcoal text-sm">{prop.views}</span>
                  <span className="text-gray-400">Views</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-deep-charcoal text-sm">{prop.inquiries}</span>
                  <span className="text-gray-400">Inquiries</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-civic-blue text-sm">{formatPrice(prop.price)}</span>
                  <span className="text-gray-400">{prop.category === 'rent' ? '/month' : 'Price'}</span>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-subtle-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleStatus(prop.id)}
                  className="text-xs"
                >
                  {prop.status === 'active' ? 'Hide' : 'Publish'}
                </Button>

                <Link href={`/properties/${prop.id}`}>
                  <Button variant="secondary" size="sm" className="text-xs">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Preview
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
