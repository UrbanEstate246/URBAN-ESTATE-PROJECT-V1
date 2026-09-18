'use client'

import React from 'react'
import { ToggleLeft, ToggleRight, Sliders } from 'lucide-react'

export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  category: 'core' | 'security' | 'storage'
}

export interface FeatureToggleProps {
  flags: FeatureFlag[]
  onToggle: (id: string) => void
}

export default function FeatureToggle({ flags, onToggle }: FeatureToggleProps) {
  return (
    <div className="bg-white border border-subtle-border rounded-xl divide-y divide-subtle-border shadow-sm">
      <div className="p-4 bg-institutional-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-civic-blue" />
          <span className="text-xs font-bold uppercase tracking-wider text-deep-charcoal">
            System Feature Flags & Kill Switches
          </span>
        </div>
        <span className="text-[11px] text-gray-400">Zero-downtime reconfiguration</span>
      </div>

      {flags.map((flag) => (
        <div key={flag.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-deep-charcoal">{flag.name}</h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  flag.enabled
                    ? 'bg-verification-green/10 text-verification-green'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {flag.enabled ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{flag.description}</p>
          </div>

          <button
            type="button"
            onClick={() => onToggle(flag.id)}
            className={`p-1 rounded-full transition-colors shrink-0 ${
              flag.enabled ? 'text-verification-green' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {flag.enabled ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
