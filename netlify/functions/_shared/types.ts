export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface SendSmsRequest {
  phone: string
  message: string
}

export interface VerifyPropertyRequest {
  propertyId: string
  status: 'verified' | 'rejected'
  adminId: string
  reason?: string
}
