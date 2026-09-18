import { useState, useEffect } from 'react'
import { PropertyWithImages } from '@/lib/types/property'
import { SAMPLE_PROPERTIES } from '@/lib/data/sampleProperties'
import { supabase } from '@/lib/supabase/client'

export function useProperties() {
  const [properties, setProperties] = useState<PropertyWithImages[]>(SAMPLE_PROPERTIES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: sbError } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (sbError || !data || data.length === 0) {
        // Fallback to verified sample dataset
        setProperties(SAMPLE_PROPERTIES)
      } else {
        setProperties(data as PropertyWithImages[])
      }
    } catch {
      setProperties(SAMPLE_PROPERTIES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
  }
}
