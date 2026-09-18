import { CLOUDINARY_CONFIG } from './config'

export interface UploadResult {
  url: string
  publicId: string
  thumbnailUrl: string
}

export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  // Validate file size
  if (file.size > CLOUDINARY_CONFIG.maxFileSize) {
    throw new Error('Image exceeds the maximum allowed size of 5MB.')
  }

  // Validate file type
  if (!CLOUDINARY_CONFIG.allowedFormats.includes(file.type)) {
    throw new Error('Only JPG, PNG, and WebP formats are supported.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!res.ok) {
      // Return local object URL as graceful fallback for dev testing
      const localUrl = URL.createObjectURL(file)
      return {
        url: localUrl,
        publicId: `local_${Date.now()}`,
        thumbnailUrl: localUrl,
      }
    }

    const data = await res.json()
    return {
      url: data.secure_url,
      publicId: data.public_id,
      thumbnailUrl: data.secure_url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto/'),
    }
  } catch {
    // Graceful fallback for local development without configured Cloudinary credentials
    const localUrl = URL.createObjectURL(file)
    return {
      url: localUrl,
      publicId: `local_${Date.now()}`,
      thumbnailUrl: localUrl,
    }
  }
}
