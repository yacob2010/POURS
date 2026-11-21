import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Wine, WineInput } from '@/types'

type Row = {
  id: number
  name: string
  type: string | null
  sub_type: string | null
  region: string | null
  vintage: number | null
  rating: number | null
  price_paid: number | null
  tasting_date: string | null
  notes: string | null
  descriptors: string[]
  created_at: string
}

const fromRow = (r: Row): Wine => ({
  id: r.id,
  name: r.name,
  type: r.type,
  subType: r.sub_type,
  region: r.region,
  vintage: r.vintage,
  rating: r.rating,
  pricePaid: r.price_paid,
  tastingDate: r.tasting_date,
  notes: r.notes,
  descriptors: r.descriptors ?? [],
  dateAdded: r.created_at,
})

const toRow = (w: Partial<WineInput>) => ({
  ...(w.name !== undefined && { name: w.name }),
  ...(w.type !== undefined && { type: w.type }),
  ...(w.subType !== undefined && { sub_type: w.subType }),
  ...(w.region !== undefined && { region: w.region }),
  ...(w.vintage !== undefined && { vintage: w.vintage }),
  ...(w.rating !== undefined && { rating: w.rating }),
  ...(w.pricePaid !== undefined && { price_paid: w.pricePaid }),
  ...(w.tastingDate !== undefined && { tasting_date: w.tastingDate }),
  ...(w.notes !== undefined && { notes: w.notes }),
  ...(w.descriptors !== undefined && { descriptors: w.descriptors }),
})

export function useWines() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else {
      setWines((data as Row[]).map(fromRow))
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addWine = async (input: WineInput) => {
    const { error } = await supabase.from('wines').insert(toRow(input))
    if (error) throw error
    await load()
  }

  const updateWine = async (id: number, input: Partial<WineInput>) => {
    const { error } = await supabase.from('wines').update(toRow(input)).eq('id', id)
    if (error) throw error
    await load()
  }

  const deleteWine = async (id: number) => {
    const { error } = await supabase.from('wines').delete().eq('id', id)
    if (error) throw error
    await load()
  }

  return { wines, loading, error, addWine, updateWine, deleteWine }
}