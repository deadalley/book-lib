import {
  assertThat,
  hasProperties,
  array,
  number,
  string,
  bool,
} from 'hamjest'
import BookFactory from './book'
import AuthorFactory from './author'
import CollectionFactory from './collection'
import UserFactory from './user'

describe('Factories', () => {
  describe('Book', () => {
    it('should create a book with required properties', () => {
      const props = {
        id: number(),
        title: string(),
        author: string(),
        owned: bool(),
        read: bool(),
        favorite: bool(),
        date: string(),
      }
      const book = BookFactory.build()
      assertThat(book, hasProperties(props))
    })
  })

  describe('Collection', () => {
    it('should create a collection of books', () => {
      const props = {
        title: string(),
        books: array(),
      }
      const collection = CollectionFactory.build()
      assertThat(collection, hasProperties(props))
    })
  })

  describe('Author', () => {
    it('should create an author with required properties', () => {
      const props = {
        id: number(),
        name: string(),
        about: string(),
        books: array(),
        image_small: string(),
        image_large: string(),
        goodreadsLink: string(),
      }
      const author = AuthorFactory.build()
      assertThat(author, hasProperties(props))
    })
  })

  describe('User', () => {
    it('should create a user', () => {
      const props = {
        id: string(),
        name: string(),
        email: string(),
        goodreadsId: string(),
      }
      const user = UserFactory.build()
      assertThat(user, hasProperties(props))
    })
  })
})
