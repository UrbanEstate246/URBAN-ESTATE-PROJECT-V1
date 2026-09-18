import { CLOUDINARY_CONFIG, getOptimizedImageUrl } from './config'

export interface TransformOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'scale' | 'thumb' | 'fit' | 'limit'
  quality?: 'auto' | 'auto:eco' | 'auto:good' | 'auto:best' | number
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  watermark?: boolean
}

export function transformCloudinaryImage(
  src: string,
  options: TransformOptions = {}
): string {
  if (!src) return '/images/placeholder.jpg'
  if (src.startsWith('/')) return src

  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    watermark = false,
  } = options

  if (src.includes('res.cloudinary.com')) {
    // If it's already a full Cloudinary URL, inject transformations
    const uploadIdx = src.indexOf('/upload/')
    if (uploadIdx !== -1) {
      const prefix = src.substring(0, uploadIdx + 8)
      const rest = src.substring(uploadIdx + 8)
      const watermarkParam = watermark ? ',l_text:Arial_24_bold:UrbanEstate,o_50,g_south_east,x_10,y_10' : ''
      return `${prefix}c_${crop},w_${width},h_${height},q_${quality},f_${format}${watermarkParam}/${rest}`
    }
    return src
  }

  // If it's a public_id
  const watermarkParam = watermark ? ',l_text:Arial_24_bold:UrbanEstate,o_50,g_south_east,x_10,y_10' : ''
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/c_${crop},w_${width},h_${height},q_${quality},f_${format}${watermarkParam}/${src}`
}

export function getThumbnailUrl(src: string, size: number = 200): string {
  return transformCloudinaryImage(src, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 'auto',
  })
}

export function getCardImageUrl(src: string): string {
  return transformCloudinaryImage(src, {
    width: 600,
    height: 400,
    crop: 'fill',
    quality: 'auto',
  })
}

export function getHeroImageUrl(src: string): string {
  return transformCloudinaryImage(src, {
    width: 1400,
    height: 800,
    crop: 'fill',
    quality: 'auto',
  })
}
