import { Handler } from '@netlify/functions'
import { successResponse, errorResponse, corsHeaders } from './_shared/utils'
import { getServiceSupabase } from './_shared/supabase'
import { VerifyPropertyRequest } from './_shared/types'

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
    const payload = JSON.parse(event.body || '{}') as VerifyPropertyRequest

    if (!payload.propertyId || !payload.status || !payload.adminId) {
      return errorResponse(
        'INVALID_PAYLOAD',
        'propertyId, status (verified | rejected), and adminId are required.'
      )
    }

    const supabase = getServiceSupabase()

    // 1. Fetch current property state
    const { data: currentProperty, error: fetchErr } = await supabase
      .from('properties')
      .select('*')
      .eq('id', payload.propertyId)
      .single()

    if (fetchErr || !currentProperty) {
      return errorResponse('PROPERTY_NOT_FOUND', 'Target property could not be found.', 404)
    }

    // 2. Update status
    const updatePayload = {
      verification_status: payload.status,
      status: payload.status === 'verified' ? 'active' : 'suspended',
      updated_at: new Date().toISOString(),
    }

    const { data: updatedProperty, error: updateErr } = await supabase
      .from('properties')
      .update(updatePayload)
      .eq('id', payload.propertyId)
      .select()
      .single()

    if (updateErr) {
      return errorResponse('UPDATE_FAILED', updateErr.message, 500)
    }

    // 3. Insert into audit_logs (append-only)
    await supabase.from('audit_logs').insert({
      user_id: payload.adminId,
      action: payload.status === 'verified' ? 'VERIFY_PROPERTY' : 'REJECT_PROPERTY',
      entity_type: 'property',
      entity_id: payload.propertyId,
      before_state: currentProperty,
      after_state: updatedProperty,
      ip_address: event.headers['client-ip'] || event.headers['x-forwarded-for'] || null,
      user_agent: event.headers['user-agent'] || null,
    })

    return successResponse({
      propertyId: payload.propertyId,
      verification_status: payload.status,
      updated_at: updatedProperty.updated_at,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Property verification processing failed.'
    return errorResponse('VERIFICATION_ERROR', message, 500)
  }
}
