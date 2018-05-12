import * as _ from 'lodash'

export const cleanFormValues = (formValues): object => {
  // tslint:disable-next-line:prefer-const
  let cleanValues = { }

  Object.keys(formValues).forEach((prop) => {
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
  if (!object) { return }
  return Object.keys(object).map((key) => object[key])
}

export const objectToArrayWithRef = (object: object) => {
  if (!object) { return }
  return Object.keys(object).map((key) => ({ ...(object[key]), ref: key }))
}

export const filterBook = (book) =>
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
    'image_small',
    'image_large',
    'gr_link'
  ])

export const filterBookForUser = (book) =>
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
    'rating'
  ])

export const filterByParam = (array: Array<any>, filter: Array<any>, param: string) => {
  return filter ? array.filter((item) => filter.includes(item[param])) : array
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
