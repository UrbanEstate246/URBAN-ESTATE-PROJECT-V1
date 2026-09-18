// Centralized API Endpoints
export const API_ENDPOINTS = {
  // Serverless Netlify Functions
  SEND_SMS: '/.netlify/functions/send-sms',
  VERIFY_PROPERTY: '/.netlify/functions/verify-property',
  WEBHOOK: '/.netlify/functions/webhook-handler',

  // Next.js App Routes
  PROPERTIES: '/api/properties',
} as const
