export class User {
  id: number
  name: string
  email: string
  books: User.Book[]
  collections: User.Collection[]
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

  export class Collection {
    title: string
    books: string[]
    description: string
  }
}

