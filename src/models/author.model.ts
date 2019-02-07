import { Book } from './book.model'

export interface Author {
  id: number
  name: string
  about: string
  books: Book[]
  imageSmall?: string
  imageLarge?: string
  goodreadsLink?: string
  isSelected: boolean
}
