import { Book } from './book'

export interface Collection {
  id: string
  title: string
  books: Book[]
  description: string
}
