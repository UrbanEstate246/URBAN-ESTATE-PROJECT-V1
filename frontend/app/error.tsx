'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected client-side errors for monitoring
    console.error('UrbanEstate Client Error:', error)
  }, [error])

  return (
    <div className="py-24 bg-institutional-white min-h-[70vh] flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-deep-charcoal mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            We encountered an unexpected issue while loading this page. Our team has been notified.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded text-left text-xs font-mono text-red-700 overflow-x-auto">
              {error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => reset()}
            >
              Try Again
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
