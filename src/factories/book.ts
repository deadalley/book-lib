import * as Factory from 'factory.ts'
import { Book } from '../interfaces/book'
import { company, date, internet, lorem, name, random, seed } from 'faker'

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
  collection: lorem.word(),
  tags: [lorem.noun],
  notes: lorem.text(),
  image_small: random.image(),
  image_large: random.image(),
  rating: random.number(),
  date: date.past().toISOString().substring(0, 10),
  gr_link: internet.url()
})

export default BookFactory
