'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { UploadCloud, X, Loader2, ImagePlus } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/cloudinary/upload'

export interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 8,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setErrorMessage(null)

    if (images.length + files.length > maxImages) {
      setErrorMessage(`You can only upload up to ${maxImages} photos per property.`)
      return
    }

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const result = await uploadToCloudinary(file)
        uploadedUrls.push(result.url)
      }
      onChange([...images, ...uploadedUrls])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setErrorMessage(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div className="space-y-3">
      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-civic-blue rounded-xl p-6 text-center cursor-pointer transition-colors bg-institutional-white group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-civic-blue/10 text-civic-blue flex items-center justify-center group-hover:scale-110 transition-transform">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-deep-charcoal">
              {uploading ? 'Uploading property photos...' : 'Click or drop property photos here'}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, or WebP up to 5MB ({images.length}/{maxImages} uploaded)
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
      )}

      {/* Thumbnail Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-lg overflow-hidden border border-subtle-border group bg-gray-100"
            >
              <Image
                src={url}
                alt={`Uploaded photo ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(index)
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-deep-charcoal/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-deep-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-civic-blue text-white text-[10px] font-bold rounded">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
