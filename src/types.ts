export interface Wine {
  id: number
  name: string
  category: string
  brand: string | null
  type: string | null
  subType: string | null
  region: string | null
  vintage: number | null
  rating: number | null
  pricePaid: number | null
  tastingDate: string | null
  notes: string | null
  descriptors: string[]
  dateAdded: string
}

export type WineInput = Omit<Wine, 'id' | 'dateAdded'>

export interface CustomValue {
  id: number
  category: string
  value: string
}