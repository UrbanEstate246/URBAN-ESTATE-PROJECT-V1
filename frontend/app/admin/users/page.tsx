'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import UserTable, { AdminUser } from '@/components/admin/UserTable'
import { Users, Search, UserPlus } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 'usr-001',
      phone: '+254 712 345 678',
      email: 'samuel.mwangi@example.com',
      role: 'landlord',
      verification_level: 2,
      trust_score: 85,
      status: 'active',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: 'usr-002',
      phone: '+254 722 888 999',
      email: 'grace.wanjiku@example.com',
      role: 'tenant',
      verification_level: 1,
      trust_score: 65,
      status: 'active',
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      id: 'usr-003',
      phone: '+254 733 111 222',
      email: 'john.otieno@example.com',
      role: 'agent',
      verification_level: 3,
      trust_score: 92,
      status: 'active',
      created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
    },
    {
      id: 'usr-004',
      phone: '+254 700 999 111',
      email: 'suspicious.account@test.com',
      role: 'tenant',
      verification_level: 0,
      trust_score: 25,
      status: 'suspended',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ])

  const [search, setSearch] = useState('')

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: u.status === 'active' ? 'suspended' : 'active',
            }
          : u
      )
    )
  }

  const filteredUsers = users.filter(
    (u) =>
      u.phone.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-institutional-white">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-deep-charcoal">
              Users & Verification Desk
            </h1>
            <p className="text-xs text-gray-500">
              Manage platform members, role assignments, and progressive trust scores.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search phone or email..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
            />
          </div>
        </div>

        <UserTable users={filteredUsers} onToggleStatus={handleToggleStatus} />
      </main>
    </div>
  )
}
