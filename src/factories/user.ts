import * as Factory from 'factory.ts'
import { User } from '../interfaces/user'
import { name, random, internet } from 'faker'

const UserFactory = Factory.makeFactory<User>({
  id: random.uuid(),
  name: `${name.firstName()} ${name.lastName()}`,
  email: internet.email(),
  goodreadsId: random.uuid(),
})

export default UserFactory
