'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building,
  Bookmark,
  Settings,
  PlusCircle,
  Home,
  ShieldCheck,
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', href: '/dashboard/properties', icon: Building },
    { label: 'Saved Homes', href: '/dashboard/saved', icon: Bookmark },
    { label: 'Account & Trust', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <aside className="w-full md:w-64 bg-white border-r border-subtle-border flex flex-col shrink-0">
      {/* Top Profile Summary */}
      <div className="p-6 border-b border-subtle-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-civic-blue text-white flex items-center justify-center font-bold text-sm">
            SM
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-deep-charcoal text-sm truncate">Samuel Mwangi</h3>
            <span className="inline-flex items-center gap-1 text-[11px] text-verification-green font-medium">
              <ShieldCheck className="w-3 h-3" /> Landlord (Verified)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5 flex-1">
        {links.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-civic-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-deep-charcoal hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-subtle-border">
          <Link
            href="/list-property"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-verification-green text-white text-xs font-semibold rounded-lg hover:bg-verification-green/90 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Property</span>
          </Link>
        </div>
      </nav>

      {/* Return to website */}
      <div className="p-4 border-t border-subtle-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-civic-blue transition-colors rounded-lg hover:bg-gray-50"
        >
          <Home className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    </aside>
  )
}
