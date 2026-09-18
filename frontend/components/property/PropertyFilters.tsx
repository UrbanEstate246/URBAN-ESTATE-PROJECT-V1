'use client'

import React from 'react'
import { Search, RotateCcw, Filter } from 'lucide-react'
import { KENYAN_COUNTIES } from '@/lib/utils/constants'

export interface FilterState {
  search: string
  category: 'all' | 'rent' | 'sale' | 'land'
  county: string
  bedrooms: string
  minPrice: string
  maxPrice: string
}

export interface PropertyFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onReset: () => void
  totalCount: number
}

export default function PropertyFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
}: PropertyFiltersProps) {
  const updateField = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    })
  }

  const categoryOptions: { label: string; value: FilterState['category'] }[] = [
    { label: 'All Listings', value: 'all' },
    { label: 'Rent', value: 'rent' },
    { label: 'Buy', value: 'sale' },
    { label: 'Land', value: 'land' },
  ]

  const bedroomOptions = ['any', '1', '2', '3', '4+']

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.county !== '' ||
    filters.bedrooms !== 'any' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== ''

  return (
    <div className="bg-white border border-subtle-border rounded-xl p-4 md:p-6 shadow-sm mb-8 space-y-4">
      {/* Category Pills & Search Input Row */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Category Switcher */}
        <div className="flex bg-institutional-white p-1 rounded-lg border border-subtle-border shrink-0">
          {categoryOptions.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => updateField('category', cat.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                filters.category === cat.value
                  ? 'bg-civic-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-deep-charcoal'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateField('search', e.target.value)}
            placeholder="Search by neighborhood, keyword, or estate..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue focus:ring-2 focus:ring-civic-blue/20 text-deep-charcoal placeholder-gray-400"
          />
        </div>
      </div>

      {/* Multi-parameter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-subtle-border/60">
        {/* County Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            County
          </label>
          <select
            value={filters.county}
            onChange={(e) => updateField('county', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue text-deep-charcoal"
          >
            <option value="">All Counties (Kenya)</option>
            {KENYAN_COUNTIES.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Bedrooms
          </label>
          <div className="flex gap-1">
            {bedroomOptions.map((bed) => (
              <button
                key={bed}
                type="button"
                onClick={() => updateField('bedrooms', bed)}
                className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${
                  filters.bedrooms === bed
                    ? 'bg-civic-blue text-white border-civic-blue'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {bed === 'any' ? 'Any' : bed}
              </button>
            ))}
          </div>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Min Price (KSh)
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => updateField('minPrice', e.target.value)}
            placeholder="e.g. 20,000"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue text-deep-charcoal placeholder-gray-400"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Max Price (KSh)
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => updateField('maxPrice', e.target.value)}
            placeholder="e.g. 100,000"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue text-deep-charcoal placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filter Stats & Reset */}
      <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span>
            Showing <strong className="text-deep-charcoal">{totalCount}</strong> verified properties
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 font-semibold text-civic-blue hover:text-civic-blue/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>
    </div>
  )
}
