'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/layout/Container'
import PropertyFilters, { FilterState } from '@/components/property/PropertyFilters'
import PropertyGrid from '@/components/property/PropertyGrid'
import { SAMPLE_PROPERTIES } from '@/lib/data/sampleProperties'
import { ShieldCheck, Sparkles } from 'lucide-react'

export default function PropertiesPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    county: '',
    bedrooms: 'any',
    minPrice: '',
    maxPrice: '',
  })

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      county: '',
      bedrooms: 'any',
      minPrice: '',
      maxPrice: '',
    })
  }

  // Filter properties based on user selection
  const filteredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter((property) => {
      // Category filter
      if (filters.category !== 'all' && property.category !== filters.category) {
        return false
      }

      // County filter
      if (filters.county && property.county.toLowerCase() !== filters.county.toLowerCase()) {
        return false
      }

      // Search keyword (matches title, area, ward, county)
      if (filters.search.trim() !== '') {
        const query = filters.search.toLowerCase()
        const matchTitle = property.title.toLowerCase().includes(query)
        const matchArea = property.area?.toLowerCase().includes(query) || false
        const matchWard = property.ward?.toLowerCase().includes(query) || false
        const matchCounty = property.county.toLowerCase().includes(query)
        if (!matchTitle && !matchArea && !matchWard && !matchCounty) {
          return false
        }
      }

      // Bedrooms filter
      if (filters.bedrooms !== 'any') {
        if (filters.bedrooms === '4+') {
          if ((property.bedrooms ?? 0) < 4) return false
        } else {
          const reqBeds = parseInt(filters.bedrooms, 10)
          if (property.bedrooms !== reqBeds) return false
        }
      }

      // Price filter
      if (filters.minPrice !== '') {
        const min = parseFloat(filters.minPrice)
        if (!isNaN(min) && property.price < min) return false
      }

      if (filters.maxPrice !== '') {
        const max = parseFloat(filters.maxPrice)
        if (!isNaN(max) && property.price > max) return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="py-8 md:py-12 bg-institutional-white min-h-[calc(100vh-160px)]">
      <Container>
        {/* Page Header Banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-verification-green/10 text-verification-green text-xs font-semibold rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Marketplace
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-2">
            Find Verified Properties in Kenya
          </h1>
          <p className="text-base text-gray-600 max-w-2xl">
            Browse legally checked rentals, homes for sale, and titled plots across Kenya with
            transparent pricing and zero hidden fees.
          </p>
        </div>

        {/* Filter Bar */}
        <PropertyFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
          totalCount={filteredProperties.length}
        />

        {/* Property Grid Results */}
        <PropertyGrid
          properties={filteredProperties}
          isLoading={false}
          onResetFilters={resetFilters}
        />
      </Container>
    </div>
  )
}
