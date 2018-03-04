import * as Factory from 'factory.ts'
import BookFactory from './book'
import { Collection } from '../interfaces/collection'
import { lorem } from 'faker'

const CollectionFactory = Factory.makeFactory<Collection>({
  title: lorem.word(),
  books: BookFactory.buildList(5)
})

export default CollectionFactory
