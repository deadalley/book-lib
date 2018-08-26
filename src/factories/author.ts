import * as Factory from 'factory.ts'
import { Author } from '../interfaces/author'
import { internet, lorem, name, random } from 'faker'

const AuthorFactory = Factory.makeFactory<Author>({
  id: random.number(),
  name: `${name.firstName()} ${name.lastName()}`,
  about: lorem.text(),
  books: [],
  image_small: random.image(),
  image_large: random.image(),
  goodreadsLink: internet.url()
})

export default AuthorFactory
