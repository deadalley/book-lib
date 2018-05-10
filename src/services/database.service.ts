import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database'
import { Router } from '@angular/router'
import { User } from '../models/user'
import { Book } from '../models/book'
import { Collection } from '../models/collection'
import { random } from 'faker'
import {
  objectToArray,
  objectToArrayWithRef,
  filterBook,
  filterBookForUser,
  filterByParam
} from '../utils/helpers'
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
    this.books.push(book)
  }

  private postBookForCollections(book) {
    this.collections.query.orderByChild('id').once('value', (snap) => {
      const allCollections = objectToArrayWithRef(snap.val())
      const collections = filterByParam(allCollections, book.collections, 'id')
      collections.forEach((collection) => this.db.list(`collections/${collection.ref}/books`).push(book.id))
    })
  }

  postBookForUser(userRef: string, userId: string, book) {
    book['id'] = random.uuid()
    this.postBook(filterBook(book))
    this.userBooksRef(userRef).push(filterBookForUser(book))

    if (book.collections) { this.postBookForCollections(book) }
  }

  findBookForUserById(userRef: string, id: string, cb) {
    this.getBooksForUserByIds(userRef, (books) => cb(books[0]), [id])
  }

  private getBooksByIds(cb, ids?: string[]) {
    this.books.valueChanges().subscribe((books) => cb(filterByParam(books, ids, 'id')))
  }

  private getBooksForUserByIds(userRef: string, cb, ids?: string[]) {
    this.userBooksRef(userRef).valueChanges().subscribe((books) => cb(filterByParam(books, ids, 'id')))
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
        this.postBookForCollections({ id: book.id, collections: collectionsToAdd })
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
    this.getCollectionsByIds((collections) => cb(collections[0]), [id])
  }

  getCollectionsByIds(cb, ids?: string[]) {
    this.collections.valueChanges().subscribe((collections) => cb(filterByParam(collections, ids, 'id')))
  }

  getCollectionsForUser(userRef: string, cb, collectionIds?: string[]) {
    // Map collections and books for user
    this.userCollectionsRef(userRef).valueChanges().subscribe((userCollections) => {
      this.getCollectionsByIds((collections) => {
        this.getBooksForUser(userRef, (books) => {
          collections.forEach((collection) => {
            if (!collection.books) {
              collection.books = []
              return
            }
            collection.books = objectToArray(collection.books)
            collection.books = filterByParam(books, collection.books, 'id')
          })
          cb(collections)
        })
      }, userCollections as string[])
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
