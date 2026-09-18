'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building,
  CheckCircle2,
  Users,
  FileText,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Review Queue',
      href: '/admin/properties',
      icon: CheckCircle2,
    },
    {
      label: 'All Properties',
      href: '/admin/properties/all',
      icon: Building,
    },
    {
      label: 'Users & Roles',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Audit Logs',
      href: '/admin/logs',
      icon: FileText,
    },
  ]

  return (
    <aside className="w-full md:w-64 bg-white border-r border-subtle-border flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-subtle-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-civic-blue text-white flex items-center justify-center font-bold text-sm">
            UE
          </div>
          <div>
            <span className="font-bold text-deep-charcoal text-sm block">UrbanEstate Admin</span>
            <span className="text-[11px] text-verification-green font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Ops Console
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5 flex-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 block mb-2">
          Verification
        </span>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
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
      </nav>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-subtle-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-civic-blue transition-colors rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Portal</span>
        </Link>
      </div>
    </aside>
  )
}
