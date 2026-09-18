import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, ArrowUpRight } from 'lucide-react'
import { PropertyWithImages } from '@/lib/types/property'
import { formatPrice } from '@/lib/utils/formatters'
import VerificationBadge from './VerificationBadge'
import Badge from '@/components/ui/Badge'

export interface PropertyCardProps {
  property: PropertyWithImages
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage =
    property.property_images && property.property_images.length > 0
      ? property.property_images[0].cloudinary_url
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'

  const locationText = [property.area, property.county].filter(Boolean).join(', ')

  return (
    <article className="group bg-white border border-subtle-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Property Image Container */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <Image
          src={primaryImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />

        {/* Category & Status Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge
            variant="civic"
            size="sm"
            className="bg-civic-blue text-white shadow-sm font-semibold capitalize"
          >
            {property.category === 'rent'
              ? 'For Rent'
              : property.category === 'sale'
                ? 'For Sale'
                : 'Land'}
          </Badge>
          {property.sponsored && (
            <Badge size="sm" className="bg-authority-amber text-white font-medium shadow-sm">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <VerificationBadge
            status={property.verification_status}
            className="bg-white/95 shadow-sm backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xl font-bold text-civic-blue">
              {formatPrice(property.price)}
              {property.category === 'rent' && (
                <span className="text-sm font-normal text-gray-500"> /mo</span>
              )}
            </span>
            <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-50 rounded border border-gray-200">
              {property.type}
            </span>
          </div>

          {/* Title */}
          <Link href={`/properties/${property.id}`} className="block group/title">
            <h3 className="text-base font-semibold text-deep-charcoal group-hover/title:text-civic-blue transition-colors line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
            <span className="truncate">{locationText || 'Kenya'}</span>
          </div>
        </div>

        {/* Specs & Action Footer */}
        <div className="pt-3 border-t border-subtle-border/80 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            {property.bedrooms !== null && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-gray-400" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
              </div>
            )}
            {property.bathrooms !== null && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-gray-400" />
                <span>{property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
              </div>
            )}
            {property.bedrooms === null && property.bathrooms === null && (
              <span className="text-xs text-gray-500 italic">Plot / Land</span>
            )}
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center text-xs font-semibold text-civic-blue hover:underline gap-0.5"
            aria-label={`View details for ${property.title}`}
          >
            Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
