import { Book } from 'interfaces/book'

export interface Author {
  id: string
  name: string
  about: string
  books: Book[]
  image_small?: string
  image_large?: string
  goodreadsLink?: string
}
