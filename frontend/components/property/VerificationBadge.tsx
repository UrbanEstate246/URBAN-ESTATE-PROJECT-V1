import React from 'react'
import { CheckCircle2, ShieldAlert, Clock } from 'lucide-react'
import { VerificationStatus } from '@/lib/types/property'

export interface VerificationBadgeProps {
  status?: VerificationStatus | string
  className?: string
}

export default function VerificationBadge({
  status = 'unverified',
  className = '',
}: VerificationBadgeProps) {
  if (status === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-verification-green/10 text-verification-green text-xs font-semibold rounded-full ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Verified
      </span>
    )
  }

  if (status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-authority-amber/15 text-authority-amber text-xs font-medium rounded-full ${className}`}
      >
        <Clock className="w-3.5 h-3.5" />
        Pending Review
      </span>
    )
  }

  if (status === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full ${className}`}
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        Rejected
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full ${className}`}
    >
      Unverified
    </span>
  )
}
