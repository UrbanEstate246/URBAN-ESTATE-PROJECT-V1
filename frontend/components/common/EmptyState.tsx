import React from 'react'
import { LucideIcon } from 'lucide-react'
import Button from '@/components/ui/Button'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-16 px-6 bg-white border border-subtle-border rounded-xl max-w-lg mx-auto ${className}`}
    >
      <div className="w-14 h-14 bg-institutional-white border border-subtle-border rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-deep-charcoal mb-1.5">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
