
import { Handler, HandlerEvent } from '@netlify/functions'
import crypto from 'crypto'
import { corsHeaders, successResponse, errorResponse } from './_shared/utils'

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return errorResponse('METHOD_NOT_ALLOWED', 'Only POST is supported', 405)
  }

  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const apiKey = process.env.CLOUDINARY_API_KEY
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'urbanestate'

    if (!apiSecret || !apiKey) {
      return errorResponse(
        'CONFIG_ERROR',
        'Cloudinary server API credentials are not configured',
        500
      )
    }

    const body = event.body ? JSON.parse(event.body) : {}
    const folder = body.folder || 'urbanestate/properties'
    const timestamp = Math.round(Date.now() / 1000)

    // Params to sign for Cloudinary
    const paramsToSign: Record<string, string | number> = {
      folder,
      timestamp,
    }

    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&')

    const stringToSign = `${sortedParams}${apiSecret}`
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

    return successResponse({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    })
  } catch (err) {
    console.error('Error generating upload signature:', err)
    return errorResponse(
      'INTERNAL_ERROR',
      err instanceof Error ? err.message : 'Failed to generate signature',
      500
    )
  }
}
