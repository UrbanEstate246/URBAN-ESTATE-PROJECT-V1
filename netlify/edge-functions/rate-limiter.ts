// In-memory sliding window rate limiter for Netlify Edge Functions
interface RateLimitRecord {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()
const WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS_PER_MINUTE = 60 // 60 requests / minute

export default async function rateLimiter(
  request: Request,
  context: { ip?: string; next: () => Promise<Response> }
) {
  const ip = context.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
  const now = Date.now()

  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + WINDOW_MS }

  if (now > record.resetAt) {
    record.count = 1
    record.resetAt = now + WINDOW_MS
  } else {
    record.count++
  }

  rateLimitMap.set(ip, record)

  if (record.count > MAX_REQUESTS_PER_MINUTE) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again shortly.',
          retryAfter,
        },
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      }
    )
  }

  return context.next()
}

export const config = {
  path: ['/api/*', '/.netlify/functions/*'],
}
