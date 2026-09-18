'use client'

import React, { useState } from 'react'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="py-12 md:py-16 bg-institutional-white min-h-[calc(100vh-160px)]">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-3">
              Contact UrbanEstate
            </h1>
            <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base">
              Have questions regarding property verification, listing partnerships, or reporting an issue?
              Our team is here to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-subtle-border">
                <div className="w-10 h-10 rounded-lg bg-civic-blue/10 text-civic-blue flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-deep-charcoal text-sm mb-1">Headquarters</h3>
                <p className="text-xs text-gray-600">
                  Kilimani Business Centre, Nairobi, Kenya
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-subtle-border">
                <div className="w-10 h-10 rounded-lg bg-civic-blue/10 text-civic-blue flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-deep-charcoal text-sm mb-1">Email Support</h3>
                <p className="text-xs text-gray-600">
                  support@urbanestate.co.ke
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-subtle-border">
                <div className="w-10 h-10 rounded-lg bg-civic-blue/10 text-civic-blue flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-deep-charcoal text-sm mb-1">Verification Desk</h3>
                <p className="text-xs text-gray-600">
                  +254 700 000 000
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2 bg-white p-8 rounded-xl border border-subtle-border">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-verification-green/10 text-verification-green flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-deep-charcoal mb-2">Message Received</h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto mb-6">
                    Thank you for reaching out. An UrbanEstate representative will contact you shortly.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Samuel Mwangi"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="samuel@example.com"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0712 345 678"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Message / Inquiry
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-civic-blue"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    <Send className="w-4 h-4 mr-2" />
                    Send Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
