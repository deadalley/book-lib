import { Book } from 'interfaces/book'

export interface Author {
  id: number
  name: string
  about: string
  books: Book[]
  imageSmall?: string
  imageLarge?: string
  goodreadsLink?: string
}
