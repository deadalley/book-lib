import * as Factory from 'factory.ts'
import { Collection } from '../interfaces/collection'
import { lorem, random } from 'faker'

const CollectionFactory = Factory.makeFactory<Collection>({
  id: random.number(),
  title: lorem.word(),
  description: lorem.sentence(),
  books: []
})

export default CollectionFactory
