'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
  showCategories?: boolean
}

export default function SearchBar({
  initialQuery = '',
  placeholder = 'Search by county, area, or property type...',
  showCategories = false,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<'all' | 'rent' | 'sale' | 'land'>('all')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('search', query.trim())
    if (category !== 'all') params.set('category', category)
    router.push(`/properties?${params.toString()}`)
  }

  const handleQuickLocation = (loc: string) => {
    setQuery(loc)
    const params = new URLSearchParams()
    params.set('search', loc)
    if (category !== 'all') params.set('category', category)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="w-full">
      {showCategories && (
        <div className="flex items-center space-x-2 mb-2">
          {(['all', 'rent', 'sale', 'land'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                category === cat
                  ? 'bg-civic-blue text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-xl shadow-md border border-gray-200"
      >
        <div className="relative flex-1 flex items-center">
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 text-sm text-deep-charcoal placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="sm:w-auto px-6 py-3 font-semibold"
        >
          Search
        </Button>
      </form>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <span className="font-medium text-gray-400">Popular:</span>
        {['Westlands', 'Kilimani', 'Karen', 'Ruiru', 'Mombasa'].map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => handleQuickLocation(loc)}
            className="hover:text-civic-blue hover:underline transition-colors"
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  )
}
