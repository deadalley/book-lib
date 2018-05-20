export class User {
  id: string
  name: string
  email: string
  books: User.Book[]
  collections: string[]
  goodreadsId: string
}

export module User {
  export class Book {
    id: string
    owned: boolean
    read: boolean
    favorite: boolean
    date: string
    genres?: string[]
    collections?: string[]
    tags?: string[]
    notes?: string
    rating?: number
  }
}

