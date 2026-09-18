'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PropertyWithImages } from '@/lib/types/property'
import { formatPrice } from '@/lib/utils/formatters'
import VerificationBadge from '@/components/property/VerificationBadge'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { MapPin, Check, X, ExternalLink } from 'lucide-react'

export interface PropertyReviewCardProps {
  property: PropertyWithImages
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export default function PropertyReviewCard({
  property,
  onApprove,
  onReject,
}: PropertyReviewCardProps) {
  const imageUrl =
    property.property_images && property.property_images.length > 0
      ? property.property_images[0].cloudinary_url
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'

  return (
    <div className="bg-white border border-subtle-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 items-start">
      {/* Image Preview */}
      <div className="relative w-full md:w-48 aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="civic" size="sm" className="bg-civic-blue text-white capitalize text-xs">
            {property.category}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 space-y-2 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <VerificationBadge status={property.verification_status} />
          <span className="text-xs text-gray-500 font-mono">ID: {property.id}</span>
        </div>

        <h3 className="text-base font-bold text-deep-charcoal">{property.title}</h3>

        <div className="flex items-center text-xs text-gray-600">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
          <span>{[property.area, property.ward, property.county].filter(Boolean).join(', ')}</span>
        </div>

        <div className="flex items-baseline gap-3 pt-1">
          <span className="text-lg font-bold text-civic-blue">
            {formatPrice(property.price)}
            {property.category === 'rent' && (
              <span className="text-xs font-normal text-gray-500"> /mo</span>
            )}
          </span>
          <span className="text-xs text-gray-500">Owner ID: {property.owner_id}</span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 pt-1 border-t border-subtle-border/60">
          {property.description || 'No description provided.'}
        </p>
      </div>

      {/* Review Actions */}
      <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-subtle-border">
        {property.verification_status !== 'verified' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onApprove(property.id)}
            className="bg-verification-green hover:bg-verification-green/90 text-white flex-1 md:flex-initial"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Approve & Verify
          </Button>
        ) : (
          <span className="text-xs font-semibold text-verification-green px-3 py-1.5 bg-verification-green/10 rounded-lg text-center">
            ✓ Approved
          </span>
        )}

        {property.verification_status !== 'rejected' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(property.id)}
            className="border-red-300 text-red-600 hover:bg-red-50 flex-1 md:flex-initial"
          >
            <X className="w-4 h-4 mr-1.5" />
            Reject Listing
          </Button>
        )}

        <Link
          href={`/properties/${property.id}`}
          target="_blank"
          className="inline-flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-civic-blue py-1"
        >
          <span>View Public Page</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
