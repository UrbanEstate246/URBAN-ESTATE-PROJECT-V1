import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  children: React.ReactNode
}

export default function Card({
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white
        border
        border-subtle-border
        rounded-xl
        p-5
        ${hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : 'shadow-sm'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
