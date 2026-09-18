import React from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="py-24 bg-institutional-white min-h-[75vh] flex items-center justify-center">
      <Container>
        <div className="max-w-lg mx-auto text-center bg-white p-10 rounded-xl shadow-sm border border-gray-100">
          <div className="text-6xl font-extrabold text-civic-blue mb-4 tracking-tight">
            404
          </div>
          <h1 className="text-2xl font-bold text-deep-charcoal mb-3">
            Property or Page Not Found
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            The listing, document, or page you are looking for may have been leased, sold, removed, or the address might be incorrect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/properties" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto">
                Browse Verified Properties
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Return Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
            UrbanEstate • Verified Kenyan Real Estate Platform
          </div>
        </div>
      </Container>
    </div>
  )
}
