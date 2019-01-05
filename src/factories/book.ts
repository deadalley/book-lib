import * as Factory from 'factory.ts'
import { Book } from '../interfaces/book'
import { company, date, lorem, name, random } from 'faker'

const BookFactory = Factory.makeFactory<Book>({
  id: random.number(),
  isbn: random.number(),
  title: `${lorem.word()} ${lorem.word()}`,
  author: `${name.firstName()} ${name.lastName()}`,
  original: lorem.sentence(),
  language: lorem.word(),
  owned: random.boolean(),
  read: random.boolean(),
  favorite: random.boolean(),
  publisher: company.companyName(),
  year: date.past().getFullYear(),
  pages: random.number(),
  genres: [lorem.word()],
  collections: [lorem.word(), lorem.word()],
  tags: [lorem.word()],
  notes: lorem.text(),
  image_small: random.image(),
  image_large: random.image(),
  rating: random.number(),
  date: date.past().toISOString().substring(0, 10),
  isSelected: random.boolean()
})

export default BookFactory
