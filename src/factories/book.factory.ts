import * as Factory from 'factory.ts'
import { Book } from 'models/book.model'
import { company, date, lorem, name, random } from 'faker'

const BookFactory = Factory.makeFactory<Book>({
  id: random.uuid(),
  ownerId: random.uuid(),
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
  collections: [],
  tags: [lorem.word()],
  notes: lorem.text(),
  imageSmall: random.image(),
  imageLarge: random.image(),
  rating: random.number(),
  date: date
    .past()
    .toISOString()
    .substring(0, 10),
  isSelected: random.boolean(),
  canBeSelected: true,
})

export default BookFactory
