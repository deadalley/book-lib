import * as Factory from 'factory.ts'
import { Collection } from '../interfaces/collection'
import { lorem, random } from 'faker'

const CollectionFactory = Factory.makeFactory<Collection>({
  title: lorem.word(),
  description: lorem.sentence(),
  books: [random.number(), random.number()]
})

export default CollectionFactory
