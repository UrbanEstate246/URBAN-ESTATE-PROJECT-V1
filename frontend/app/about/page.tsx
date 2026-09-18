import React from 'react'
import Container from '@/components/layout/Container'
import { ShieldCheck, Target, Award, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="py-12 md:py-16 bg-institutional-white min-h-[calc(100vh-160px)]">
      <Container>
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-verification-green/10 text-verification-green text-xs font-semibold rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Institutional Mission
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-4">
              Restoring Trust in Kenyan Real Estate
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              UrbanEstate is building Kenya’s most trusted real estate ecosystem. We replace uncertainty,
              fraudulent title transactions, and opaque rental pricing with verified, institutional integrity.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-subtle-border">
              <div className="w-10 h-10 rounded-lg bg-civic-blue text-white flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-deep-charcoal mb-2">Verification First</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We believe that trust is earned through rigor. Every property listed is cross-referenced
                with official records, physical geo-tags, and owner verification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-subtle-border">
              <div className="w-10 h-10 rounded-lg bg-civic-blue text-white flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-deep-charcoal mb-2">Zero Hidden Fees</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tenants and buyers never face hidden charges or upfront viewing extortion. Prices
                displayed are real, transparent, and direct from property owners.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-subtle-border">
              <div className="w-10 h-10 rounded-lg bg-civic-blue text-white flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-deep-charcoal mb-2">Empowering Landlords</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Authentic landlords and licensed developers gain high-intent tenants faster by
                showcasing certified verification credentials.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-subtle-border">
              <div className="w-10 h-10 rounded-lg bg-civic-blue text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-deep-charcoal mb-2">Silent Security</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our multi-layered fraud detection and strict audit logging run seamlessly in the
                background, protecting your identity and transactions.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
