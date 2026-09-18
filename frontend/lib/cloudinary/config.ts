// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'urbanestate',
  uploadPreset:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'urbanestate_properties',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
}

export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options?: { width?: number; height?: number; crop?: string }
): string {
  if (!publicIdOrUrl) return ''
  if (publicIdOrUrl.startsWith('http')) return publicIdOrUrl

  const width = options?.width || 800
  const height = options?.height || 600
  const crop = options?.crop || 'c_fill'

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${width},h_${height},${crop},q_auto,f_auto/${publicIdOrUrl}`
}
