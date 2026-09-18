'use client'

import React from 'react'
import Link from 'next/link'
import { SAMPLE_PROPERTIES } from '@/lib/data/sampleProperties'
import PropertyCard from '@/components/property/PropertyCard'
import Button from '@/components/ui/Button'
import { Bookmark, Search } from 'lucide-react'

export default function DashboardSavedPropertiesPage() {
  const savedProperties = SAMPLE_PROPERTIES.slice(0, 3)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-deep-charcoal">Saved Properties</h1>
        <p className="text-xs text-gray-500">
          Homes and plots you have bookmarked for easy comparison and direct contact.
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="text-center py-16 bg-white border border-subtle-border rounded-xl">
          <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-deep-charcoal text-base">No saved properties yet</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 mb-4">
            Click the bookmark icon on any property to save it here for future reference.
          </p>
          <Link href="/properties">
            <Button variant="primary" size="sm">
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Browse Properties
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  )
}
