import { Handler } from '@netlify/functions'
import { successResponse, errorResponse, corsHeaders } from './_shared/utils'
import { getServiceSupabase } from './_shared/supabase'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return errorResponse('METHOD_NOT_ALLOWED', 'Only POST requests are permitted.', 405)
  }

  try {
    const rawPayload = event.body || '{}'
    const payload = JSON.parse(rawPayload)
    const source = event.headers['x-webhook-source'] || 'generic'

    const supabase = getServiceSupabase()

    // Record webhook event into audit_logs for inspection
    await supabase.from('audit_logs').insert({
      action: `WEBHOOK_RECEIVED_${source.toUpperCase()}`,
      entity_type: 'webhook',
      entity_id: null,
      before_state: null,
      after_state: payload,
      ip_address: event.headers['client-ip'] || event.headers['x-forwarded-for'] || null,
      user_agent: event.headers['user-agent'] || null,
    })

    return successResponse({
      received: true,
      timestamp: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing error.'
    return errorResponse('WEBHOOK_FAILED', message, 500)
  }
}
