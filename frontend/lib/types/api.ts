export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export interface SmsSendPayload {
  to: string
  message: string
}

export interface SmsSendResponse {
  success: boolean
  messageId?: string
  error?: string
}

export interface VerifyPropertyPayload {
  propertyId: string
  action: 'approve' | 'reject'
  reviewNotes?: string
}

export interface CloudinarySignaturePayload {
  folder?: string
  tags?: string[]
}

export interface CloudinarySignatureResponse {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}
