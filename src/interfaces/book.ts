export interface Book {
  id: string
  ownerId: string
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
  goodreadsId?: number
  goodreadsLink?: string
  goodreadsAuthorId?: number
}
