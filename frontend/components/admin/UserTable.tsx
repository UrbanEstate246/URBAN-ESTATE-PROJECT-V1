'use client'

import React from 'react'
import { ShieldCheck, UserCheck, Ban, CheckCircle } from 'lucide-react'

export interface AdminUser {
  id: string
  phone: string
  email: string
  role: 'tenant' | 'landlord' | 'agent' | 'admin'
  verification_level: number
  trust_score: number
  status: 'active' | 'suspended'
  created_at: string
}

export interface UserTableProps {
  users: AdminUser[]
  onToggleStatus: (userId: string) => void
}

export default function UserTable({ users, onToggleStatus }: UserTableProps) {
  return (
    <div className="bg-white border border-subtle-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-institutional-white border-b border-subtle-border text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Trust Score</th>
              <th className="p-4">Verification</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="font-semibold text-deep-charcoal block">{user.phone}</span>
                  <span className="text-[11px] text-gray-400">{user.email}</span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : user.role === 'landlord'
                          ? 'bg-civic-blue/10 text-civic-blue'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-deep-charcoal">{user.trust_score}</span>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          user.trust_score >= 80
                            ? 'bg-verification-green'
                            : user.trust_score >= 50
                              ? 'bg-authority-amber'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(user.trust_score, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-verification-green" />
                    Tier {user.verification_level}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'active'
                        ? 'bg-verification-green/10 text-verification-green'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(user.id)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                      user.status === 'active'
                        ? 'border border-red-200 text-red-600 hover:bg-red-50'
                        : 'border border-green-200 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
