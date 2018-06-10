export interface Book {
  id: string
  title: string
  author: string
  owned: boolean
  read: boolean
  favorite: boolean
  date: string
  isbn?: number
  original?: string
  language?: string
  publisher?: string
  year?: number
  pages?: number
  genres?: string[]
  collections?: string[]
  tags?: string[]
  notes?: string
  image_small?: string
  image_large?: string
  rating?: number
  isSelected?: boolean
  canBeSelected?: boolean
  goodreadsLink?: string
  goodreadsId?: number
  goodreadsAuthorId?: number
}
