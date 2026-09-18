import { ApiResponse } from './types'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
}

export function successResponse<T>(data: T, statusCode = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
  }
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  }
}

export function errorResponse(code: string, message: string, statusCode = 400) {
  const body: ApiResponse = {
    success: false,
    error: {
      code,
      message,
    },
  }
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  }
}
