import * as Factory from 'factory.ts'
import { User } from '../models/user.model'
import { name, random, internet } from 'faker'

const UserFactory = Factory.makeFactory<User>({
  id: random.uuid(),
  uid: random.uuid(),
  name: `${name.firstName()} ${name.lastName()}`,
  email: internet.email(),
  books: [],
  collections: [],
  goodreadsId: random.uuid(),
  displayWelcomeMessage: random.random(),
})

export default UserFactory
