import Link from 'next/link'
import Container from '@/components/layout/Container'
import PropertyCard from '@/components/property/PropertyCard'
import { SAMPLE_PROPERTIES } from '@/lib/data/sampleProperties'
import { ShieldCheck, CheckCircle2, ArrowRight, Building, KeyRound, Search } from 'lucide-react'

export default function HomePage() {
  const featuredProperties = SAMPLE_PROPERTIES.slice(0, 3)

  return (
    <div className="space-y-16 py-12 md:py-20 bg-institutional-white">
      {/* Hero Section */}
      <section>
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-verification-green/10 text-verification-green text-xs font-semibold rounded-full mb-6">
              <ShieldCheck className="w-4 h-4" />
              Kenya&apos;s Institutional Property Verification Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-deep-charcoal tracking-tight mb-6 leading-tight">
              Verified properties. <br className="hidden sm:inline" />
              Clear pricing. <span className="text-civic-blue">No surprises.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Find your next home, rental, or titled parcel in Kenya with complete confidence.
              Legally vetted listings from verified property owners.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/properties"
                className="w-full sm:w-auto bg-civic-blue text-white px-8 py-3.5 rounded-lg font-medium hover:bg-civic-blue/90 transition-all shadow-sm flex items-center justify-center gap-2 text-base"
              >
                <Search className="w-4 h-4" />
                Browse Verified Properties
              </Link>
              <Link
                href="/list-property"
                className="w-full sm:w-auto bg-white text-civic-blue border-2 border-civic-blue px-8 py-3.5 rounded-lg font-medium hover:bg-civic-blue hover:text-white transition-all text-base flex items-center justify-center"
              >
                List Your Property
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="mt-12 pt-8 border-t border-subtle-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-subtle-border">
                <CheckCircle2 className="w-5 h-5 text-verification-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-deep-charcoal">Verified Title Deeds</h4>
                  <p className="text-xs text-gray-500">Cross-checked parcel records and ownership proof.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-subtle-border">
                <CheckCircle2 className="w-5 h-5 text-verification-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-deep-charcoal">Zero Viewing Extortion</h4>
                  <p className="text-xs text-gray-500">No predatory broker charges before viewing properties.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-subtle-border">
                <CheckCircle2 className="w-5 h-5 text-verification-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-deep-charcoal">Transparent Pricing</h4>
                  <p className="text-xs text-gray-500">Fixed, honest rental and sale rates with no hidden markups.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Properties Section */}
      <section className="py-4">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-civic-blue">
                Verified Highlights
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-deep-charcoal mt-1">
                Featured Properties in Kenya
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center text-sm font-semibold text-civic-blue hover:text-civic-blue/80 transition-colors gap-1"
            >
              View all listings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </Container>
      </section>

      {/* Platform Value Proposition */}
      <section className="bg-white border-y border-subtle-border py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-charcoal mb-4">
              A Safer Way to Rent, Buy & Sell in Kenya
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Kenya’s real estate market has suffered from fraud, fake landlords, and double-allocated land.
              UrbanEstate restores trust through institutional-grade vetting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-institutional-white border border-subtle-border">
              <div className="w-12 h-12 rounded-xl bg-civic-blue text-white flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-deep-charcoal mb-2">Physical Geo-Verification</h3>
              <p className="text-sm text-gray-600">
                Every listing is confirmed to exist physically with GPS landmarks and active utility validation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-institutional-white border border-subtle-border">
              <div className="w-12 h-12 rounded-xl bg-civic-blue text-white flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-deep-charcoal mb-2">Direct Owner Contact</h3>
              <p className="text-sm text-gray-600">
                Connect directly with certified property owners and accredited agents without predatory middlemen.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-institutional-white border border-subtle-border">
              <div className="w-12 h-12 rounded-xl bg-civic-blue text-white flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-deep-charcoal mb-2">Land Title Checks</h3>
              <p className="text-sm text-gray-600">
                Title numbers and registry searches are confirmed before listings receive the Verified badge.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
