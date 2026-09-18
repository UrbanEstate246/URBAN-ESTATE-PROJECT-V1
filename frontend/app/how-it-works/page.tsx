import React from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import { Search, ShieldCheck, Key, UploadCloud, CheckCircle } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="py-12 md:py-16 bg-institutional-white min-h-[calc(100vh-160px)]">
      <Container>
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-4">
              How UrbanEstate Works
            </h1>
            <p className="text-gray-600 text-base max-w-xl mx-auto">
              Whether you are searching for a new home or listing your properties in Kenya, here is
              how our verification process guarantees safety.
            </p>
          </div>

          {/* For Tenants / Buyers */}
          <div className="bg-white border border-subtle-border rounded-xl p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-civic-blue">For Seekers</span>
            <h2 className="text-2xl font-bold text-deep-charcoal mt-1 mb-8">Finding Your Next Property</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-civic-blue/10 text-civic-blue font-bold flex items-center justify-center">
                  1
                </div>
                <h3 className="font-semibold text-deep-charcoal">Search & Filter</h3>
                <p className="text-sm text-gray-600">
                  Search by county, ward, price range, or bedrooms. Filter exclusively for verified
                  listings.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-civic-blue/10 text-civic-blue font-bold flex items-center justify-center">
                  2
                </div>
                <h3 className="font-semibold text-deep-charcoal">Review Verification Details</h3>
                <p className="text-sm text-gray-600">
                  Inspect title validation, amenity checks, and physical GPS pins before reaching out.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-civic-blue/10 text-civic-blue font-bold flex items-center justify-center">
                  3
                </div>
                <h3 className="font-semibold text-deep-charcoal">Connect Directly</h3>
                <p className="text-sm text-gray-600">
                  Contact verified property owners directly. Schedule viewings without paying upfront
                  broker fees.
                </p>
              </div>
            </div>
          </div>

          {/* For Landlords */}
          <div className="bg-white border border-subtle-border rounded-xl p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-verification-green">
              For Landlords & Agents
            </span>
            <h2 className="text-2xl font-bold text-deep-charcoal mt-1 mb-8">Listing With Confidence</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-verification-green/10 text-verification-green font-bold flex items-center justify-center">
                  1
                </div>
                <h3 className="font-semibold text-deep-charcoal">Submit Property Details</h3>
                <p className="text-sm text-gray-600">
                  Upload photos, enter location, price, and specs through our streamlined property form.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-verification-green/10 text-verification-green font-bold flex items-center justify-center">
                  2
                </div>
                <h3 className="font-semibold text-deep-charcoal">Verification Review</h3>
                <p className="text-sm text-gray-600">
                  Our team checks parcel numbers and ownership documents within 24 hours.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-verification-green/10 text-verification-green font-bold flex items-center justify-center">
                  3
                </div>
                <h3 className="font-semibold text-deep-charcoal">Receive Qualified Inquiries</h3>
                <p className="text-sm text-gray-600">
                  Verified listings get up to 4x more viewings and attract verified, high-trust tenants.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center pt-4">
            <Link href="/properties">
              <Button variant="primary" size="lg">
                Explore Available Properties
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
