'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import { KENYAN_COUNTIES, AMENITIES } from '@/lib/utils/constants'
import { ShieldCheck, CheckCircle2, ArrowRight, Building, Plus } from 'lucide-react'

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'rent',
    type: 'Apartment',
    price: '',
    county: 'Nairobi',
    area: '',
    ward: '',
    bedrooms: '2',
    bathrooms: '2',
    description: '',
    selectedAmenities: [] as string[],
  })

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter((a) => a !== amenity)
        : [...prev.selectedAmenities, amenity],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="py-12 bg-institutional-white min-h-[calc(100vh-160px)]">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-verification-green/10 text-verification-green text-xs font-semibold rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Landlord Program
            </div>
            <h1 className="text-3xl font-bold text-deep-charcoal mb-2">
              List Your Property on UrbanEstate
            </h1>
            <p className="text-sm text-gray-600">
              Submit your property for verification. Once vetted, your listing receives the verified
              badge and reaches qualified tenants across Kenya.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white border border-subtle-border rounded-xl p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-verification-green/10 text-verification-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-deep-charcoal mb-2">
                  Listing Submitted for Verification
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Thank you! Your listing has been received with status{' '}
                  <span className="font-semibold text-authority-amber">Pending Review</span>. Our
                  verification team will review title records and contact you within 24 hours.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/properties">
                  <Button variant="primary">
                    Browse All Listings
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  List Another Property
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-subtle-border rounded-xl p-6 md:p-8 space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-deep-charcoal mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-civic-blue" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Property Title *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Spacious 2 Bedroom Apartment in Kilimani"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                      >
                        <option value="rent">For Rent</option>
                        <option value="sale">For Sale</option>
                        <option value="land">Land / Plot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Property Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Villa">Villa</option>
                        <option value="Bedsitter">Bedsitter</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Land">Land</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Price (KSh) *
                      </label>
                      <input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g. 50,000"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="pt-4 border-t border-subtle-border">
                <h2 className="text-lg font-semibold text-deep-charcoal mb-4">Location</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">County *</label>
                    <select
                      value={formData.county}
                      onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                    >
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Area / Neighborhood *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. Kilimani, Westlands, Ruaka"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Ward</label>
                    <input
                      type="text"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      placeholder="e.g. Karuri, Biashara"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="pt-4 border-t border-subtle-border">
                <h2 className="text-lg font-semibold text-deep-charcoal mb-4">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-4 border-t border-subtle-border">
                <h2 className="text-lg font-semibold text-deep-charcoal mb-2">Amenities & Features</h2>
                <p className="text-xs text-gray-500 mb-4">Select all amenities available at this property.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AMENITIES.map((amenity) => {
                    const isChecked = formData.selectedAmenities.includes(amenity)
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-left flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-civic-blue/5 border-civic-blue text-civic-blue'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-civic-blue" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-subtle-border">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the property, nearby landmarks, lease conditions, and features..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth>
                <Plus className="w-4 h-4 mr-2" />
                Submit Property for Verification
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  )
}
