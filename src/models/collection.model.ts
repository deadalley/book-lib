import { Book } from './book.model'

export interface Collection {
  id: string
  ownerId: string
  title: string
  books: Book[]
  description: string
}
