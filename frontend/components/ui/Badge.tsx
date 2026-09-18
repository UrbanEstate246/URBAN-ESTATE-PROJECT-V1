import React from 'react'

export interface BadgeProps {
  variant?: 'default' | 'civic' | 'success' | 'warning' | 'outline'
  size?: 'sm' | 'md'
  className?: string
  children: React.ReactNode
}

export default function Badge({
  variant = 'default',
  size = 'md',
  className = '',
  children,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full'

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  const variantStyles = {
    default: 'bg-gray-100 text-deep-charcoal',
    civic: 'bg-civic-blue/10 text-civic-blue',
    success: 'bg-verification-green/10 text-verification-green',
    warning: 'bg-authority-amber/15 text-authority-amber',
    outline: 'bg-transparent border border-subtle-border text-deep-charcoal',
  }

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
