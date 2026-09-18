import React from 'react'
import { Home, RefreshCw } from 'lucide-react'
import { PropertyWithImages } from '@/lib/types/property'
import PropertyCard from './PropertyCard'
import Button from '@/components/ui/Button'

export interface PropertyGridProps {
  properties: PropertyWithImages[]
  isLoading?: boolean
  onResetFilters?: () => void
}

export default function PropertyGrid({
  properties,
  isLoading = false,
  onResetFilters,
}: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white border border-subtle-border rounded-xl overflow-hidden p-4 space-y-4 animate-pulse"
          >
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-4/5" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white border border-subtle-border rounded-xl max-w-xl mx-auto my-8">
        <div className="w-14 h-14 bg-institutional-white border border-subtle-border rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Home className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-deep-charcoal mb-2">No properties found</h3>
        <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
          We could not find any properties matching your current filter criteria. Try expanding your
          search or clearing some filters.
        </p>
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Reset all filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
