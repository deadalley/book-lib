import * as Factory from 'factory.ts'
import { User } from '../models/user.model'
import { name, random, internet } from 'faker'

const UserFactory = Factory.makeFactory<User>({
  id: random.uuid(),
  uid: random.uuid(),
  name: `${name.firstName()} ${name.lastName()}`,
  email: internet.email(),
  collections: [],
  books: [],
  goodreadsId: random.uuid(),
  avatarUrl: random.image(),
  displayWelcomeMessage: random.boolean(),
  backgroundUrl: random.image(),
})

export default UserFactory
