import * as Factory from 'factory.ts'
import { Author } from '../models/author.model'
import { internet, lorem, name, random } from 'faker'

const AuthorFactory = Factory.makeFactory<Author>({
  id: random.number(),
  name: `${name.firstName()} ${name.lastName()}`,
  about: lorem.text(),
  books: [],
  imageSmall: random.image(),
  imageLarge: random.image(),
  goodreadsLink: internet.url(),
  isSelected: random.boolean(),
})

export default AuthorFactory
