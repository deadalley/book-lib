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

  findUserById(id: number, cb) {
    this.users.query.orderByChild('id').equalTo(id).once('value', (snap) => cb(snap.val()))
  }

  findBookById({ userRef, bookId }, cb) {
    this.getBooksForUser(userRef, (books) => {
      cb(books[0])
    }, [bookId])
  }

  findCollectionById(id: string, cb) {
    this.collections.query.orderByChild('id').equalTo(id).once('value', (snap) => {
      cb(objectToArray(snap.val())[0])
    })
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

  updateCollection(collection) {
    this.collections.query.orderByChild('id').equalTo(collection.id).once('value', (snap) => {
      const ref = Object.keys(snap.val())[0]
      this.db.object(`collections/${ref}/title`).set(collection.title)
      this.db.object(`collections/${ref}/description`).set(collection.description)
    })
  }

  updateBookForUser({ userRef, userId }, book) {
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

  deleteBookFromCollection(userId, book) {
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

  deleteBook({ userRef, userId }, book) {
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

  postBookForCollection(userId, book) {
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

  postBookForUser({ userRef, userId }, book) {
    book['id'] = random.uuid()
    this.postBook(filterBook(book))
    this.userBooksRef(userRef).push(filterBookForUser(book))

    this.postBookForCollection(userId, book)
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
}
