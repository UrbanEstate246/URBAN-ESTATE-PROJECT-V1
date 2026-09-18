'use client'

import React, { useRef, useState, useEffect } from 'react'

export interface OTPInputProps {
  length?: number
  value: string
  onChange: (otp: string) => void
  disabled?: boolean
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
}: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))

  useEffect(() => {
    const valDigits = value.split('').slice(0, length)
    const padded = [...valDigits, ...Array(length - valDigits.length).fill('')]
    setDigits(padded)
  }, [value, length])

  const handleChange = (index: number, val: string) => {
    const lastChar = val.slice(-1)
    if (val && !/^\d+$/.test(lastChar)) return

    const newDigits = [...digits]
    newDigits[index] = lastChar
    const combined = newDigits.join('')
    onChange(combined)

    if (lastChar && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted)
      const focusIndex = Math.min(pasted.length, length - 1)
      inputsRef.current[focusIndex]?.focus()
    }
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length }, (_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[idx] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-white border border-gray-300 rounded-lg focus:border-civic-blue focus:ring-2 focus:ring-civic-blue/20 focus:outline-none transition-all text-deep-charcoal disabled:bg-gray-100"
        />
      ))}
    </div>
  )
}
