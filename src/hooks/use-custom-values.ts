import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { CustomValue } from '@/types'

export function useCustomValues() {
  const [customValues, setCustomValues] = useState<CustomValue[]>([])

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('custom_values')
      .select('id, category, value')
      .order('created_at')
    setCustomValues((data as CustomValue[]) ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addCustomValue = async (category: string, value: string) => {
    const { error } = await supabase.from('custom_values').insert({ category, value })
    // 23505 = already exists, which is fine
    if (error && error.code !== '23505') throw error
    await load()
  }

  return { customValues, addCustomValue }
}