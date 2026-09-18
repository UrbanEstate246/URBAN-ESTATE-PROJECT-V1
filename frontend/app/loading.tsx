import React from 'react'
import Container from '@/components/layout/Container'
import Spinner from '@/components/ui/Spinner'

export default function Loading() {
  return (
    <div className="py-24 bg-institutional-white min-h-[60vh] flex items-center justify-center">
      <Container>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Spinner size="lg" color="civic" />
          <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
            Loading UrbanEstate...
          </p>
        </div>
      </Container>
    </div>
  )
}
