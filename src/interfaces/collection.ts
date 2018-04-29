import { Book } from './book'

export interface Collection {
  title: string
  books: Book[]
  description: string
}
