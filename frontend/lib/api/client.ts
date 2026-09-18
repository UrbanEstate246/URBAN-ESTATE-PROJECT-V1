export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const data = await res.json()
    return data as ApiResponse<T>
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network request failed.'
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message,
      },
    }
  }
}
