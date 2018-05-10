import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database'
import { Router } from '@angular/router'
import { User } from '../models/user'
import { Book } from '../models/book'
import { Collection } from '../models/collection'
import { random } from 'faker'
import { objectToArray, filterBook, filterBookForUser } from '../utils/helpers'
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

  /** USER **/
  postUser(user: User) {
    return this.users.push(user)
  }

  findUserById(id: number, cb) {
    this.users.query.orderByChild('id').equalTo(id).once('value', (snap) => cb(snap.val()))
  }

  /** BOOK **/
  private postBook(book: Book) {
    this.books.push({ id: random.uuid(), ...(book) })
  }

  postBookForCollection(userId: string, book) {
    // Get collections of user
    this.collections.query.orderByChild('owner').equalTo(userId).once('value', (snap) => {
      // Map object to array
      let collections = Object.keys(snap.val()).map((key) => ({ ...(snap.val()[key]), ref: key }))

      if (book.collections) {
        collections = collections.filter((collection) => book.collections.includes(collection['title']))
        collections.forEach((collection) => {
          // Add to collection
          this.db.list(`collections/${collection.ref}/books`).push(book.id)
        })
      }
    })
  }

  postBookForUser(userRef: string, userId: string, book) {
    book['id'] = random.uuid()
    this.postBook(filterBook(book))
    this.userBooksRef(userRef).push(filterBookForUser(book))

    this.postBookForCollection(userId, book)
  }

  findBookForUserById(userRef: string, bookId: string, cb) {
    this.getBooksForUserByIds(userRef, (books) => cb(books[0]), [bookId])
  }

  private getBooksByIds(cb, ids?: string[]) {
    this.books.valueChanges().subscribe((books) => cb(ids ? books.filter((book) => ids.includes(book['id'])) : books))
  }

  private getBooksForUserByIds(userRef: string, cb, ids?: string[]) {
    this.userBooksRef(userRef).valueChanges().subscribe((books) => cb(ids ? books.filter((book) => ids.includes(book['id'])) : books))
  }

  getBooksForUser(userRef: string, cb, bookIds?: string[]) {
    // Join books and user books
    this.getBooksForUserByIds(userRef, (userBooks) => {
      this.getBooksByIds((books) => {
        const mappedBooks = userBooks.reduce((obj, book) => (obj[book['id']] = book, obj), {})
        const mergedBooks = books.map((book) => ({ ...(book), ...(mappedBooks[book.id]) }))

        cb(mergedBooks)
      }, bookIds)
    }, bookIds)
  }

  updateBookForUser(userRef: string, userId: string, book) {
    this.userBooksRef(userRef).query.orderByChild('id').equalTo(book.id).once('value', (snap) => {
      const ref = Object.keys(snap.val())[0]
      const oldBook = snap.val()[ref]

      this.db.object(`users/${userRef}/books/${ref}`).set(filterBookForUser(book))

      if (!book.collections) { book.collections = [] }
      if (!oldBook.collections) { oldBook.collections = [] }

      const collectionsToAdd = book.collections.filter((collection) => !oldBook.collections.includes(collection))
      const collectionsToRemove = oldBook.collections.filter((collection) => !book.collections.includes(collection))

      if (collectionsToAdd.length > 0 ) {
        this.postBookForCollection(userId, { id: book.id, collections: collectionsToAdd })
      }

      if (collectionsToRemove.length > 0) {
        this.deleteBookFromCollection(userId, { id: book.id, collections: collectionsToRemove })
      }
    })
    this.books.query.orderByChild('id').equalTo(book.id).once('value', (snap) => {
      const ref = Object.keys(snap.val())[0]
      this.db.object(`books/${ref}`).set(filterBook(book))
    })
  }

  deleteBookFromCollection(userId: string, book) {
    // Get collections of user
    this.collections.query.orderByChild('owner').equalTo(userId).once('value', (snap) => {
      // Map object to array
      let collections = Object.keys(snap.val()).map((key) => ({ ...(snap.val()[key]), ref: key }))

      if (book.collections) {
        collections = collections.filter((collection) => book.collections.includes(collection['title']))
        collections.forEach((collection) => {
          // Remove from collection
          this.db.list(`collections/${collection.ref}/books`).query
            .orderByValue()
            .equalTo(book.id)
            .once('value', (_snap) => {
              if (!_snap.val()) { return }
              const ref = Object.keys(_snap.val())[0]
              this.db.list(`collections/${collection.ref}/books/${ref}`).remove()
            })
        })
      }
    })
  }

  deleteBook(userRef: string, userId: string, book) {
    this.books.query.orderByChild('id').equalTo(book.id).on('value', (snap) => {
      if (!snap.val()) { return }
      const ref = Object.keys(snap.val())[0]

      this.db.object(`books/${ref}`).remove()
    })

    this.userBooksRef(userRef).query.orderByChild('id').equalTo(book.id).on('value', (snap) => {
      if (!snap.val()) { return }
      const ref = Object.keys(snap.val())[0]

      this.db.object(`users/${userRef}/books/${ref}`).remove()
    })

    this.deleteBookFromCollection(userId, book)
  }

  /** COLLECTION **/
  private postCollection(collection: Collection) {
    this.collections.push({ id: random.uuid(), ...(collection) })
  }

  postCollectionForUser(userRef: string, collection) {
    collection['id'] = random.uuid()
    this.userCollectionsRef(userRef).push(collection['id'])
    this.postCollection(collection)
  }

  findCollectionById(id: string, cb) {
    this.collections.query.orderByChild('id').equalTo(id).once('value', (snap) => {
      cb(objectToArray(snap.val())[0])
    })
  }

  getCollectionsForUser(userRef: string, userId: string, cb) {
    // Map collections and books for user
    this.collections.query.orderByChild('owner').equalTo(userId).on('value', (snap) => {
      if (snap.val() === null) { return }

      const collections = objectToArray(snap.val())

      this.getBooksForUserByIds(userRef, (books) => {
        const mappedCollections = collections.map((collection) => {
          const collectionBooks = objectToArray(collection.books)

          return {
            id: collection['id'],
            title: collection['title'],
            books: collection['books'] ? books.filter((book) => collectionBooks.includes(book['id'])) : [],
            description: collection['description']
          }
        })

        cb(mappedCollections)
      })
    })
  }

  updateCollection(collection) {
    this.collections.query.orderByChild('id').equalTo(collection.id).once('value', (snap) => {
      const ref = Object.keys(snap.val())[0]
      this.db.object(`collections/${ref}/title`).set(collection.title)
      this.db.object(`collections/${ref}/description`).set(collection.description)
    })
  }

  deleteCollection(userRef: string, userId: string, collection) {
    this.collections.query.orderByChild('id').equalTo(collection.id).on('value', (snap) => {
      if (!snap.val()) { return }
      // tslint:disable-next-line:no-shadowed-variable
      const ref = Object.keys(snap.val())[0]

      this.db.object(`collections/${ref}`).remove()
    })

    this.userCollectionsRef(userRef).query.orderByValue().equalTo(collection.id).on('value', (snap) => {
      if (!snap.val()) { return }
      const ref = Object.keys(snap.val())[0]
      this.db.object(`users/${userRef}/collections/${ref}`).remove()
    })
    // TODO: Remove collections from books
  }
}
