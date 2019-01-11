import { Book } from './book'

export interface Collection {
  id: string
  ownerId: string
  title: string
  books: Book[]
  description: string
}
