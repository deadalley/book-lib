import * as _ from 'lodash'

export const cleanFormValues = (formValues): object => {
  // tslint:disable-next-line:prefer-const
  let cleanValues = {}

  Object.keys(formValues).forEach(prop => {
    if (typeof formValues[prop] !== 'undefined') {
      cleanValues[prop] = formValues[prop]
    }
  })
  return cleanValues
}

export const parseFirebaseAuthError = (error): string => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please provide a valid e-mail'
    case 'auth/user-not-found':
      return 'User not found'
    case 'auth/wrong-password':
      return 'Wrong password'
    default:
      return 'Could not login. Try again.'
  }
}

export const objectToArray = (object: object) => {
  if (!object) {
    return
  }
  return Object.keys(object).map(key => object[key])
}

export const arrayToObjectWithId = (array: any[]) => {
  if (!array) {
    return
  }
  return array.reduce((obj, item) => ((obj[item.id] = item), obj), {})
}

export const objectToArrayWithRef = (object: object) => {
  if (!object) {
    return
  }
  return Object.keys(object).map(key => ({ ...object[key], ref: key }))
}

export const findKeyByValue = (object: object, value: any) =>
  _.findKey(object, _value => _value === value)

export const filterBook = book =>
  _.pick(book, [
    'id',
    'title',
    'author',
    'isbn',
    'original',
    'language',
    'publisher',
    'year',
    'pages',
    'imageSmall',
    'imageLarge',
    'goodreadsLink',
    'goodreadsId',
    'goodreadsAuthorId',
  ])

export const filterBookForUser = book =>
  _.pick(book, [
    'id',
    'owned',
    'read',
    'favorite',
    'date',
    'genres',
    'collections',
    'tags',
    'notes',
    'rating',
  ])

export const filterByParam = (array: any[], filter: any[], param: string) => {
  return filter ? array.filter(item => filter.includes(item[param])) : array
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const parseAuthorName = book => {
  if (book.authors) {
    if (Array.isArray(book.authors.author)) {
      return book.authors.author[0].name
    } else {
      return book.authors.author.name
    }
  }

  return book.author.name
}

const parseBookId = book => {
  if (book.work) {
    if (book.work.id._) {
      return book.work.id._
    } else {
      return book.work.id
    }
  } else {
    return book.id._
  }
}

export const parseBook = book => ({
  title: book.title,
  author: parseAuthorName(book),
  isbn: book.isbn,
  publisher: book.publisher,
  year: book.publication_year,
  pages: book.num_pages,
  imageLarge: book.large_image_url ? book.large_image_url : book.image_url,
  imageSmall: book.small_image_url,
  goodreadsLink: book.link,
  goodreadsId: parseBookId(book),
  goodreadsAuthorId: book.authors ? book.authors.author.id : book.author.id._,
})

export const parseAuthor = (author, books?) => ({
  id: author.id,
  name: author.name,
  about: author.about,
  books,
  imageSmall: author.small_image_url,
  imageLarge: author.large_image_url
    ? author.large_image_url
    : author.image_url,
  goodreadsLink: author.link,
})

export const scrollToAnchor = (location: string, wait: number): void => {
  const element = document.querySelector('#' + location)
  if (element) {
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    }, wait)
  }
}

export const upperCaseFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const removeSpaces = (string: string) => string.replace(/\s/g, '')

export const unique = array => _.uniq(array)
