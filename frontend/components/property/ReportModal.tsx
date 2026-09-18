'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string
  propertyTitle: string
}

const REPORT_REASONS = [
  { value: 'incorrect_details', label: 'Inaccurate details or fake photos' },
  { value: 'scam_pricing', label: 'Suspicious or unrealistically low pricing' },
  { value: 'duplicate', label: 'Duplicate listing by multiple agents' },
  { value: 'unauthorized_listing', label: 'Poster is not the authorized owner or manager' },
  { value: 'already_leased', label: 'Property is already leased or sold' },
  { value: 'other', label: 'Other violation' },
]

export default function ReportModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
}: ReportModalProps) {
  const [reason, setReason] = useState(REPORT_REASONS[0].value)
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate dispatch to Netlify/Supabase report endpoint
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 600)
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setDetails('')
    setReason(REPORT_REASONS[0].value)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Report Listing"
    >
      <p className="text-xs text-gray-500 mb-4 -mt-2">
        Help maintain a secure platform. Reports are reviewed by UrbanEstate Trust & Safety.
      </p>
      {isSubmitted ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-50 text-verification-green flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-deep-charcoal mb-1">
            Report Received
          </h4>
          <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
            Thank you for keeping UrbanEstate safe. Our integrity team will inspect listing #{propertyId.slice(0, 8)}.
          </p>
          <Button variant="primary" onClick={handleReset} fullWidth size="md">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-authority-amber shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              Reporting: <strong className="font-semibold">{propertyTitle}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-deep-charcoal uppercase tracking-wider mb-2">
              Reason for reporting
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    reason === r.value
                      ? 'border-civic-blue bg-civic-blue/5 text-deep-charcoal font-medium'
                      : 'border-subtle-border hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="report_reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-civic-blue focus:ring-civic-blue"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-deep-charcoal uppercase tracking-wider mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any evidence or details to assist our verification team..."
              className="w-full px-3 py-2 text-xs border border-subtle-border rounded-lg focus:outline-none focus:border-civic-blue focus:ring-2 focus:ring-civic-blue/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-subtle-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
