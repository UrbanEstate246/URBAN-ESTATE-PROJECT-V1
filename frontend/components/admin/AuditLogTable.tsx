'use client'

import React from 'react'
import { formatDate } from '@/lib/utils/formatters'
import { Shield, FileCheck, AlertTriangle } from 'lucide-react'

export interface AuditLogEntry {
  id: string
  action: string
  entity_type: string | null
  entity_id: string | null
  user_id: string | null
  ip_address: string | null
  created_at: string
}

export interface AuditLogTableProps {
  logs: AuditLogEntry[]
}

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="bg-white border border-subtle-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-institutional-white border-b border-subtle-border text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Actor</th>
              <th className="p-4">IP Address</th>
              <th className="p-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle-border">
            {logs.map((log) => {
              const isVerification = log.action.includes('VERIFY')
              const isRejection = log.action.includes('REJECT') || log.action.includes('SUSPEND')

              return (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold ${
                        isVerification
                          ? 'bg-verification-green/10 text-verification-green'
                          : isRejection
                            ? 'bg-red-100 text-red-700'
                            : 'bg-civic-blue/10 text-civic-blue'
                      }`}
                    >
                      {isVerification ? (
                        <FileCheck className="w-3.5 h-3.5" />
                      ) : isRejection ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <Shield className="w-3.5 h-3.5" />
                      )}
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-deep-charcoal block capitalize">
                      {log.entity_type || 'System'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {log.entity_id ? log.entity_id.slice(0, 8) + '...' : 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-gray-600">
                      {log.user_id ? log.user_id.slice(0, 8) + '...' : 'System'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-gray-500">
                      {log.ip_address || '127.0.0.1'}
                    </span>
                  </td>
                  <td className="p-4 text-right text-gray-500">
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
