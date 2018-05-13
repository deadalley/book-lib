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
  arrayToObjectWithId,
  filterBook,
  filterBookForUser,
  filterByParam
} from '../utils/helpers'
import * as firebase from 'firebase/app'
import * as _ from 'lodash'
import { merge } from 'rxjs/observable/merge'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/takeUntil'

@Injectable()
export class DatabaseService {
  private users: AngularFireList<User>
  private books: AngularFireList<Book>
  private collections: AngularFireList<Collection>
  isLoggedIn$ = new Subject<boolean>()

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

    if (!!localStorage.getItem('userLocalCredentials')) {
      this.isLoggedIn$.next(true)
    }
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

  postBooksForCollections(books) {
    this.collections.query.orderByChild('id').once('value', (snap) => {
      const allCollections = objectToArrayWithRef(snap.val())
      books.forEach((book) => {
        const collections = filterByParam(allCollections, book.collections, 'id')
        collections.forEach((collection) => this.db.list(`collections/${collection.ref}/books`).push(book.id))
      })
    })
  }

  postBookForUser(userRef: string, book) {
    book['id'] = random.uuid()
    this.postBook(filterBook(book))
    this.userBooksRef(userRef).push(filterBookForUser(book))

    if (book.collections) { this.postBooksForCollections([book]) }
  }

  findBookForUserById(userRef: string, id: string, cb) {
    this.getBooksForUser(userRef, (books) => cb(books[0]), [id])
  }

  private getBooksByIds(cb, ids?: string[]) {
    this.books.valueChanges().takeUntil(this.isLoggedIn$).subscribe((books) => {
      cb(filterByParam(books, ids, 'id'))
    })
  }

  private getBooksForUserByIds(userRef: string, cb, ids?: string[]) {
    this.userBooksRef(userRef).valueChanges().takeUntil(this.isLoggedIn$).subscribe((books) => {
      cb(filterByParam(books, ids, 'id'))
    })
  }

  getBooksForUser(userRef: string, cb, bookIds?: string[]) {
    // Join books and user books
    this.getBooksForUserByIds(userRef, (userBooks) => {
      this.getBooksByIds((books) => {
        const mappedBooks = arrayToObjectWithId(userBooks)
        const mergedBooks = books.map((book) => ({ ...(book), ...(mappedBooks[book.id]) }))
        if (mergedBooks.some((book) => book.collections)) {
          this.getCollectionsByIds((collections) => {
            mergedBooks.forEach((book) => {
              if (!book.collections) { return }
              book.collections = filterByParam(collections, objectToArray(book.collections), 'id').map((collection) => collection.title)
            })
            cb(mergedBooks)
          })
        } else { cb(mergedBooks) }
      }, userBooks.map((book) => book.id))
    }, bookIds)
  }

  getLatestBooks(userRef: string, cb) {
    this.books.query.orderByChild('date').limitToFirst(5).once('value', (snap) => {
      const latestBooks = arrayToObjectWithId(objectToArray(snap.val()))
      this.getBooksForUserByIds(userRef, (books) => {
        const mergedBooks = books.map((book) => ({
          ...(book),
          ...(latestBooks[book.id])
        }))
        cb(mergedBooks)
      }, objectToArray(latestBooks).map((book) => book.id))
    })
  }

  private updateBook(book) {
    this.books.query.orderByChild('id').equalTo(book.id).once('value', (snap) => {
      const ref = Object.keys(snap.val())[0]
      const oldBook = snap.val()
      this.db.object(`books/${ref}`).set(book)
    })
  }

  private updateBookCollections(bookId: string, oldCollections: string[], newCollections: string[]) {
    if (!newCollections) { newCollections = [] }
    if (!oldCollections) { oldCollections = [] }

    const collectionsToAdd = newCollections.filter((collection) => !oldCollections.includes(collection))
    const collectionsToRemove = oldCollections.filter((collection) => !newCollections.includes(collection))

    if (collectionsToAdd.length > 0 ) {
      this.postBooksForCollections([{ id: bookId, collections: collectionsToAdd }])
    }

    if (collectionsToRemove.length > 0) {
      this.deleteBooksFromCollection([{ id: bookId, collections: collectionsToRemove }])
    }
  }

  updateBookForUser(userRef: string, book) {
    this.userBooksRef(userRef).query.orderByChild('id').equalTo(book.id).once('value', (snap) => {
      const ref = Object.keys(snap.val())[0]
      const oldCollections = objectToArray(snap.val()[ref].collections)
      const newCollections = book.collections

      if (!book.collections) { book.collections = ['placeholder'] }
      this.db.object(`users/${userRef}/books/${ref}`).set(filterBookForUser(book))

      if (newCollections) {
        this.db.object(`users/${userRef}/books/${ref}/collections`).set(newCollections)
      } else {
        this.db.object(`users/${userRef}/books/${ref}/collections`).remove()
      }

      this.updateBookCollections(book.id, oldCollections, newCollections)
    })
    this.updateBook(filterBook(book))
  }

  deleteBooksFromCollection(books) {
    this.collections.query.orderByChild('id').once('value', (snap) => {
      const allCollections = objectToArrayWithRef(snap.val())
      books.forEach((book) => {
        const collections = filterByParam(allCollections, book.collections, 'id')
        collections.forEach((collection) => {
          this.db.list(`collections/${collection.ref}/books`).query
            .orderByValue()
            .equalTo(book.id)
            .once('value', (_snap) => {
              if (!_snap.val()) { return }
              const ref = Object.keys(_snap.val())[0]
              this.db.list(`collections/${collection.ref}/books/${ref}`).remove()
            })
        })
      })
    })
  }

  deleteBook(userRef: string, book) {
    this.books.query.orderByChild('id').equalTo(book.id).once('value', (snap) => {
      if (!snap.val()) { return }
      const ref = Object.keys(snap.val())[0]

      this.db.object(`books/${ref}`).remove()
    })

    this.userBooksRef(userRef).query.orderByChild('id').equalTo(book.id).once('value', (snap) => {
      if (!snap.val()) { return }
      const ref = Object.keys(snap.val())[0]

      this.db.object(`users/${userRef}/books/${ref}`).remove()
    })

    if (book.collections) { this.deleteBooksFromCollection([book]) }
  }

  /** COLLECTION **/
  private postCollection(collection: Collection) {
    this.collections.push({ id: random.uuid(), ...(collection) })
  }

  postCollectionForUser(userRef: string, collection) {
    collection['id'] = random.uuid()
    this.db.object(`users/${userRef}`).query.once('value', (snap) => {
      const id = snap.val().id
      console.log(id)
      collection['owner'] = id
      this.userCollectionsRef(userRef).push(collection['id'])
      this.postCollection(collection)
    })
    return collection.id
  }

  postCollectionForBooks(userRef: string, collectionId: string, bookIds: string) {
    this.userBooksRef(userRef).query.orderByKey().once('value', (snap) => {
      const books = objectToArrayWithRef(snap.val())
      books.filter((book) => bookIds.includes(book.id))
           .forEach((book) => this.db.list(`users/${userRef}/books/${book.ref}/collections`).push(collectionId))
    })
  }

  findCollectionById(id: string, cb) {
    this.getCollectionsByIds((collections) => cb(collections[0]), [id])
  }

  getCollectionsByIds(cb, ids?: string[]) {
    const subscription = this.collections.valueChanges().subscribe((collections) => {
      cb(filterByParam(collections, ids, 'id'))
      subscription.unsubscribe()
    })
  }

  getCollectionsForUser(userRef: string, cb, collectionIds?: string[]) {
    // Map collections and books for user
    const subscription = this.userCollectionsRef(userRef).valueChanges().subscribe((userCollections) => {
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
          subscription.unsubscribe()
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

  deleteCollectionFromBooks(userRef: string, collectionId: string, bookIds: string[]) {
    this.userBooksRef(userRef).query.orderByKey().once('value', (snap) => {
      const books = objectToArrayWithRef(snap.val())
      books.filter((book) => bookIds.includes(book.id))
           .forEach((book) => {
              this.db.list(`users/${userRef}/books/${book.ref}/collections`).query
                .orderByValue()
                .equalTo(collectionId)
                .once('value', (_snap) => {
                  if (!_snap.val()) { return }
                  const ref = Object.keys(_snap.val())[0]
                  this.db.object(`users/${userRef}/books/${book.ref}/collections/${ref}`).remove()
                })
           })
    })
  }

  deleteCollection(userRef: string, collection) {
    const collectionBooks = collection.books.map((book) => book.id)
    this.deleteCollectionFromBooks(userRef, collection.id, collectionBooks)

    this.collections.query.orderByChild('id').equalTo(collection.id).once('value', (snap) => {
      if (!snap.val()) { return }
      const ref = Object.keys(snap.val())[0]

      this.db.object(`collections/${ref}`).remove()
    })

    this.userCollectionsRef(userRef).query.orderByValue().equalTo(collection.id).once('value', (snap) => {
      if (!snap.val()) { return }
      const ref = Object.keys(snap.val())[0]

      this.db.object(`users/${userRef}/collections/${ref}`).remove()
    })
  }
}
