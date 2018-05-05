import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database'
import { Router } from '@angular/router'
import { User } from '../models/user'
import { Book } from '../models/book'
import { Collection } from '../models/collection'
import { random } from 'faker'
import { objectToArray } from '../utils/helpers'
import * as firebase from 'firebase/app'
import * as _ from 'lodash'

@Injectable()
export class DatabaseService {
  private users: AngularFireList<User>
  private books: AngularFireList<Book>
  private collections: AngularFireList<Collection>

  private userRef(userRef: string): AngularFireObject<User> {
    return this.db.object(`users/${userRef}`)
  }

  private userBooksRef(userRef: string): AngularFireList<User.Book> {
    return this.db.list(`users/${userRef}/books`)
  }

  private userCollectionsRef(userRef: string): AngularFireList<string> {
    return this.db.list(`users/${userRef}/collections`)
  }

  constructor (private db: AngularFireDatabase) {
    this.books = db.list('books')
    this.users = db.list('users')
    this.collections = db.list('collections')
  }

  findUserById(id: number, cb) {
    this.users.query.orderByChild('id').equalTo(id).once('value', (snap) => cb(snap.val()))
  }

  findBookById({ userRef, bookId }, cb) {
    this.getBooksForUser(userRef, (books) => {
      console.log(books[0])
      cb(books[0])
    }, [bookId])
  }

  getBooksByIds(ids: string[], cb) {
    this.books.valueChanges().subscribe((books) => cb(ids ? books.filter((book) => ids.includes(book['id'])) : []))
  }

  postUser(user: User) {
    return this.users.push(user)
  }

  private postBook(book: Book) {
    this.books.push({ id: random.uuid(), ...(book) })
  }

  private postCollection(collection: Collection) {
    this.collections.push({ id: random.uuid(), ...(collection) })
  }

  postBookForUser({ userRef, userId }, book) {
    book['id'] = random.uuid()
    this.postBook(_.pick(book, [
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
    ]))
    this.userBooksRef(userRef).push(_.pick(book, [
      'id',
      'owned',
      'read',
      'favorite',
      'date',
      'genres',
      'collections',
      'tags',
      'notes',
      'ratings'
    ]))

    // Get collections of user
    this.collections.query.orderByChild('owner').equalTo(userId).once('value', (snap) => {
      // Map object to array
      console.log(snap.val())
      let collections = Object.keys(snap.val()).map((key) => ({ ...(snap.val()[key]), ref: key }))

      console.log(collections)
      console.log(book.collections)
      if (book.collections) {
        collections = collections.filter((collection) => book.collections.includes(collection['title']))
        console.log(collections)
        collections.forEach((collection) => {
          // Add to collection
          this.db.list(`collections/${collection.ref}/books`).push(book.id)
        })
      }
    })
  }

  postCollectionForUser(userRef: string, collection) {
    collection['id'] = random.uuid()
    this.userCollectionsRef(userRef).push(collection['id'])
    this.postCollection(collection)
  }

  getBooksForUser(userRef: string, cb, bookIds: number[] = []) {
    // Join books and user books
    this.userBooksRef(userRef).valueChanges().subscribe((userBooks) => {
      // Map array to object where keys are the book ids and values are the books
      const mappedBooks = userBooks.reduce((obj, book) => (obj[book['id']] = book, obj), {})

      this.getBooksByIds(Object.keys(mappedBooks), (books) => {
        let mergedBooks = books.map((book) => ({ ...(book), ...(mappedBooks[book['id']]) }))

        if (bookIds.length > 0) {
          mergedBooks = mergedBooks.filter((book) => bookIds.includes(book['id']))
        }
        cb(mergedBooks)
      })
    })
  }

  getCollectionsForUser({ userRef, userId }, cb) {
    // Map collections and books for user
    this.collections.query.orderByChild('owner').equalTo(userId).on('value', (snap) => {
      if (snap.val() === null) { return }

      const collections = objectToArray(snap.val())

      this.getBooksForUser(userRef, (books) => {
        const mappedCollections = collections.map((collection) => {
          const collectionBooks = objectToArray(collection.books)

          return {
            title: collection['title'],
            books: collection['books'] ? books.filter((book) => collectionBooks.includes(book['id'])) : [],
            description: collection['description']
          }
        })

        cb(mappedCollections)
      })
    })
  }
}
