/**
 * UrbanEstate Helper Utilities
 * General purpose utilities for string formatting, references, and sanitization
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + suffix
}

export function generateReferenceNumber(prefix: string = 'UE'): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${randomStr}`
}

export function sanitizeInput(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim()
}

export function getInitials(name: string): string {
  if (!name) return 'UE'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatCoordinates(lat?: number | null, lng?: number | null): string {
  if (lat === undefined || lat === null || lng === undefined || lng === null) {
    return 'Location not pinned'
  }
  const latDirection = lat >= 0 ? 'N' : 'S'
  const lngDirection = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(4)}° ${latDirection}, ${Math.abs(lng).toFixed(4)}° ${lngDirection}`
}

export function parseKenyanPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '')
  if (cleaned.startsWith('+254')) return cleaned
  if (cleaned.startsWith('254')) return `+${cleaned}`
  if (cleaned.startsWith('0')) return `+254${cleaned.substring(1)}`
  return cleaned
}
