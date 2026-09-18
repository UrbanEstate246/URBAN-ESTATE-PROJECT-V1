import React from 'react'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'civic' | 'white' | 'green'
  className?: string
}

export default function Spinner({
  size = 'md',
  color = 'civic',
  className = '',
}: SpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  const colorStyles = {
    civic: 'border-civic-blue/20 border-t-civic-blue',
    white: 'border-white/20 border-t-white',
    green: 'border-verification-green/20 border-t-verification-green',
  }

  return (
    <div
      className={`rounded-full animate-spin ${sizeStyles[size]} ${colorStyles[color]} ${className}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
