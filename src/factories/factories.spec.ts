import { assertThat, hasProperties, number, string, bool, not, equalTo } from 'hamjest'
import BookFactory from './book'
import { Book } from '../interfaces/book'
import { FactoryArray, GenericFactory } from './utils'

describe('Book', () => {
  it('should create a book with required properties', () => {
    const props = {
      id: number(),
      title: string(),
      author: string(),
      owned: bool(),
      read: bool(),
      favorite: bool()
    }
    const book = BookFactory.build()
    assertThat(book, hasProperties(props))
  })
})

describe('Utils', () => {
  it('should return an array of factories', () => {
    const factories = FactoryArray(GenericFactory, 5)
    factories.forEach((item, idx) => {
      if (idx === factories.length - 1) { return }
      assertThat(item, not(equalTo(factories[idx + 1])))
    })
  })
})
