import { Handler } from '@netlify/functions'
import { successResponse, errorResponse, corsHeaders } from './_shared/utils'
import { SendSmsRequest } from './_shared/types'

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
    const payload = JSON.parse(event.body || '{}') as SendSmsRequest

    if (!payload.phone || !payload.message) {
      return errorResponse('INVALID_PAYLOAD', 'Phone number and message content are required.')
    }

    const username = process.env.AFRICASTALKING_USERNAME
    const apiKey = process.env.AFRICASTALKING_API_KEY
    const senderId = process.env.AFRICASTALKING_SENDER_ID || 'URBANESTATE'

    // If live credentials are not set, return simulated success for staging
    if (!username || !apiKey) {
      return successResponse({
        status: 'simulated',
        recipient: payload.phone,
        message: 'SMS service simulated (credentials not configured in environment).',
      })
    }

    // Africa's Talking API endpoint
    const postData = new URLSearchParams({
      username,
      to: payload.phone,
      message: payload.message,
      from: senderId,
    })

    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: postData.toString(),
    })

    const data = await res.json()
    return successResponse(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to process SMS request.'
    return errorResponse('SMS_SEND_FAILED', message, 500)
  }
}
