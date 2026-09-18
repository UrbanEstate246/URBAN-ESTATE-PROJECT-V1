'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Container from '@/components/layout/Container'
import VerificationBadge from '@/components/property/VerificationBadge'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { SAMPLE_PROPERTIES } from '@/lib/data/sampleProperties'
import { formatPrice } from '@/lib/utils/formatters'
import {
  MapPin,
  Bed,
  Bath,
  ArrowLeft,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  Share2,
  Calendar,
} from 'lucide-react'

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyId = params?.id as string

  const property = SAMPLE_PROPERTIES.find((p) => p.id === propertyId)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!property) {
    return (
      <div className="py-20 bg-institutional-white min-h-[60vh] flex items-center justify-center">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl border border-subtle-border">
            <h1 className="text-2xl font-bold text-deep-charcoal mb-3">Property Not Found</h1>
            <p className="text-gray-600 mb-6 text-sm">
              The property you are looking for does not exist or may have been removed.
            </p>
            <Link href="/properties">
              <Button variant="primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const images =
    property.property_images && property.property_images.length > 0
      ? property.property_images.map((img) => img.cloudinary_url)
      : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80']

  const amenitiesList = Array.isArray(property.amenities)
    ? (property.amenities as string[])
    : []

  return (
    <div className="py-8 bg-institutional-white min-h-screen">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/properties"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-civic-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to all properties
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">ID: {property.id}</span>
          </div>
        </div>

        {/* Title & Price Header */}
        <div className="bg-white border border-subtle-border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="civic" size="sm" className="font-semibold uppercase text-xs">
                  {property.category === 'rent'
                    ? 'For Rent'
                    : property.category === 'sale'
                      ? 'For Sale'
                      : 'Land'}
                </Badge>
                <VerificationBadge status={property.verification_status} />
                {property.sponsored && (
                  <Badge size="sm" className="bg-authority-amber text-white font-medium">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-deep-charcoal mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1 text-gray-400 shrink-0" />
                <span>
                  {[property.area, property.ward, property.county].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>

            <div className="md:text-right">
              <div className="text-2xl md:text-3xl font-extrabold text-civic-blue">
                {formatPrice(property.price)}
                {property.category === 'rent' && (
                  <span className="text-base font-normal text-gray-500"> /month</span>
                )}
              </div>
              <span className="text-xs text-verification-green font-semibold">
                ✓ No hidden booking fees
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white border border-subtle-border rounded-xl p-3 overflow-hidden">
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 mb-3">
                <Image
                  src={images[selectedImageIndex]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-civic-blue ring-2 ring-civic-blue/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Key Specs */}
            <div className="bg-white border border-subtle-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-deep-charcoal mb-4">Property Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-institutional-white rounded-lg border border-subtle-border">
                  <span className="block text-xs text-gray-500 mb-1">Type</span>
                  <strong className="text-sm text-deep-charcoal font-semibold">{property.type}</strong>
                </div>

                {property.bedrooms !== null && (
                  <div className="p-3 bg-institutional-white rounded-lg border border-subtle-border">
                    <span className="block text-xs text-gray-500 mb-1">Bedrooms</span>
                    <strong className="text-sm text-deep-charcoal font-semibold flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-gray-400" />
                      {property.bedrooms} Beds
                    </strong>
                  </div>
                )}

                {property.bathrooms !== null && (
                  <div className="p-3 bg-institutional-white rounded-lg border border-subtle-border">
                    <span className="block text-xs text-gray-500 mb-1">Bathrooms</span>
                    <strong className="text-sm text-deep-charcoal font-semibold flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-gray-400" />
                      {property.bathrooms} Baths
                    </strong>
                  </div>
                )}

                <div className="p-3 bg-institutional-white rounded-lg border border-subtle-border">
                  <span className="block text-xs text-gray-500 mb-1">County</span>
                  <strong className="text-sm text-deep-charcoal font-semibold">
                    {property.county}
                  </strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-subtle-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-deep-charcoal mb-3">About this property</h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description || 'No detailed description provided.'}
              </p>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div className="bg-white border border-subtle-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-deep-charcoal mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center text-sm text-gray-700 gap-2">
                      <div className="w-5 h-5 rounded-full bg-verification-green/10 text-verification-green flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Inquire / Landlord Contact */}
          <div className="space-y-6">
            <div className="bg-white border border-subtle-border rounded-xl p-6 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-subtle-border">
                <ShieldCheck className="w-6 h-6 text-verification-green" />
                <div>
                  <h3 className="font-semibold text-deep-charcoal text-sm">Verified Property Protection</h3>
                  <p className="text-xs text-gray-500">Inspected by UrbanEstate Kenya</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button variant="primary" fullWidth size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Verified Landlord
                </Button>

                <Button variant="outline" fullWidth size="md">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Viewing
                </Button>
              </div>

              <div className="bg-institutional-white p-4 rounded-lg border border-subtle-border text-xs text-gray-600 space-y-2">
                <p className="font-medium text-deep-charcoal">UrbanEstate Assurance:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Never pay viewing or agent registration fees upfront.</li>
                  <li>Title and lease terms verified with county records.</li>
                  <li>Report suspicious listings directly to admin.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
