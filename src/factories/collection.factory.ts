import * as Factory from 'factory.ts'
import { Collection } from '../models/collection.model'
import { lorem, random } from 'faker'

const CollectionFactory = Factory.makeFactory<Collection>({
  id: random.uuid(),
  ownerId: random.uuid(),
  title: lorem.word(),
  description: lorem.sentence(),
  books: [],
})

export default CollectionFactory
