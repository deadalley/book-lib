import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { User } from '../database/models/user.model'
import { Book } from '../database/models/book.model'
import { Collection } from '../database/models/collection.model'
import {
  objectToArray,
  findKeyByValue,
  unique,
} from '../utils/helpers'
import { environment } from 'environments/environment'
import { Subject } from 'rxjs/Subject'

@Injectable()
export class DatabaseService {
  users: AngularFireList<User>
  books: AngularFireList<Book>
  collections: AngularFireList<Collection>
  isLoggedIn$ = new Subject<boolean>()
  rootUrl = environment.name === 'development' ? 'test' : ''

  private userBooksRef(userRef: string): AngularFireList<string> {
    return this.db.list(`${this.rootUrl}/users/${userRef}/books`)
  }

  private userCollectionsRef(userRef: string): AngularFireList<string> {
    return this.db.list(`${this.rootUrl}/users/${userRef}/collections`)
  }

  constructor(private db: AngularFireDatabase) {
    this.books = db.list(`${this.rootUrl}/books`)
    this.users = db.list(`${this.rootUrl}/users`)
    this.collections = db.list(`${this.rootUrl}/collections`)
  }

  cleanTestBed() {
    console.log('Cleaning test bed')
    if (environment.name !== 'development') {
      return
    }

    this.books.remove()
    this.users.remove()
    this.collections.remove()
  }

  private findById(
    id: string,
    model: AngularFireList<any>,
    parseFn: (object, id) => {}
  ) {
    return model.query
      .orderByKey()
      .equalTo(id)
      .once('value')
      .then(snap =>
        snap.val()
          ? parseFn(
              snap.val()[Object.keys(snap.val())[0]],
              Object.keys(snap.val())[0]
            )
          : null
      )
  }

  private findByParam(
    key: string,
    value: string,
    model: AngularFireList<any>,
    parseFn: (object, id) => {}
  ) {
    return model.query
      .orderByChild(key)
      .equalTo(value)
      .once('value')
      .then(snap =>
        snap.val()
          ? parseFn(
              snap.val()[Object.keys(snap.val())[0]],
              Object.keys(snap.val())[0]
            )
          : null
      )
  }

  private getByParams(
    key: string,
    value: string,
    model: AngularFireList<any>,
    parseFn: (object, id) => {}
  ) {
    return model.query
      .orderByChild(key)
      .equalTo(value)
      .once('value')
      .then(snap =>
        snap.val()
          ? Object.keys(snap.val()).map(_key => parseFn(snap.val()[_key], _key))
          : []
      )
  }

  /** USER **/
  private parseUser(user: User, id: string) {
    return {
      ...user,
      id,
      books: objectToArray(user.books) || [],
      collections: objectToArray(user.collections) || [],
    }
  }

  createUser(user: User) {
    return this.users.push(user).then(res => this.parseUser(user, res.ref.key))
  }

  findUserById(id: string) {
    return this.findById(id, this.users, this.parseUser).then(
      user => user as User
    )
  }

  findUserByParam(key: string, value: string) {
    return this.findByParam(key, value, this.users, this.parseUser).then(user => user as User)
  }

  updateUser(id: string, params: object) {
    this.users.update(id, params as User)
    return this.findUserById(id)
  }

  /** BOOK **/
  private parseBook(book: Book, id: string) {
    return {
      ...book,
      id,
      genres: book.genres || [],
      collections: book.collections || [],
      tags: book.tags || [],
    }
  }

  private createBook(book: Book) {
    return this.books.push(book).then(res => this.parseBook(book, res.ref.key))
  }

  private getBooksByParam(key: string, value: string) {
    return this.getByParams(key, value, this.books, this.parseBook)
  }

  createBookForUser(userRef: string, book) {
    return this.createBook({ ...book, ownerId: userRef }).then(
      bookInDatabase => {
        return Promise.all([
          this.userBooksRef(userRef).push(bookInDatabase.id),
          ...book.collections.map(collectionId => {
            return this.addBooksToCollection(collectionId, [bookInDatabase.id])
          }),
        ]).then(() => bookInDatabase)
      }
    )
  }

  findBookById(id: string) {
    return this.findById(id, this.books, this.parseBook).then(
      book => book as Book
    )
  }

  getBooksForUser(userRef: string) {
    return this.getBooksByParam('ownerId', userRef)
  }

  getBooksForCollection(id: string, userRef: string) {
    return this.getBooksForUser(userRef).then(books =>
      books.filter(book => book.collections.includes(id))
    )
  }

  updateBookForUser(userRef: string, book: Book) {
    return this.findBookById(book.id).then(oldBook => {
      const oldCollections = oldBook.collections || []
      const newCollections = book.collections || []

      const collectionsToAdd = newCollections.filter(
        collection => !oldCollections.includes(collection)
      )
      const collectionsToRemove = oldCollections.filter(
        collection => !newCollections.includes(collection)
      )

      return Promise.all([
        this.books.update(book.id, { ...oldBook, ...book }),
        ...collectionsToAdd.map(collectionId =>
          this.addBooksToCollection(collectionId, [book.id])
        ),
        ...collectionsToRemove.map(collectionId =>
          this.removeBooksFromCollection(collectionId, [book.id])
        ),
      ])
    })
  }

  deleteBook(userRef: string, book: Book) {
    return Promise.all([
      this.books.remove(book.id),
      this.userBooksRef(userRef)
        .query.once('value')
        .then(bookIds => {
          const bookRef = findKeyByValue(bookIds, book.id)
          return this.userBooksRef(userRef).remove(bookRef)
        }),
      ...book.collections.map(collectionId =>
        this.removeBooksFromCollection(collectionId, [book.id])
      ),
    ])
  }

  /** COLLECTION **/
  private parseCollection(collection: Collection, id: string) {
    return {
      ...collection,
      id,
      books: collection.books || [],
    }
  }

  private createCollection(collection: Collection) {
    return this.collections
      .push(collection)
      .then(res => this.parseCollection(collection, res.ref.key))
  }

  private getCollectionsByParam(key: string, value: string) {
    return this.getByParams(key, value, this.collections, this.parseCollection)
  }

  createCollectionForUser(userRef: string, collection) {
    return this.createCollection({ ...collection, ownerId: userRef }).then(
      collectionInDatabase => {
        return Promise.all([
          this.userCollectionsRef(userRef).push(collectionInDatabase.id),
          ...collectionInDatabase.books.map(bookId =>
            this.addCollectionsToBook(bookId, [collectionInDatabase.id])
          ),
        ]).then(() => collectionInDatabase)
      }
    )
  }

  findCollectionById(id: string) {
    return this.findById(id, this.collections, this.parseCollection).then(
      collection => collection as Collection
    )
  }

  getCollectionsForUser(userRef: string) {
    return this.getCollectionsByParam('ownerId', userRef)
  }

  updateCollectionForUser(userRef: string, collection: Collection) {
    return this.findCollectionById(collection.id).then(oldCollection => {
      const oldBooks = oldCollection.books || []
      const newBooks = collection.books || []

      const booksToAdd = newBooks.filter(book => !oldBooks.includes(book))
      const booksToRemove = oldBooks.filter(book => !newBooks.includes(book))

      return Promise.all([
        this.collections.update(collection.id, {
          ...oldCollection,
          ...collection,
        }),
        ...booksToAdd.map(bookId =>
          this.addCollectionsToBook(bookId, [collection.id])
        ),
        ...booksToRemove.map(bookId =>
          this.removeCollectionsFromBook(bookId, [collection.id])
        ),
      ])
    })
  }

  deleteCollection(userRef: string, collection: Collection) {
    return Promise.all([
      this.collections.remove(collection.id),
      this.userCollectionsRef(userRef)
        .query.once('value')
        .then(collectionIds => {
          const collectionRef = findKeyByValue(collectionIds, collection.id)
          return this.userCollectionsRef(userRef).remove(collectionRef)
        }),
      ...collection.books.map(bookId =>
        this.removeCollectionsFromBook(bookId, [collection.id])
      ),
    ])
  }

  addBooksToCollection(id: string, bookIds: string[]) {
    return this.findCollectionById(id).then(collection => {
      const booksForCollection = [...bookIds, ...collection.books]
      return this.collections
        .update(id, {
          books: unique(booksForCollection),
        } as Collection)
        .then(() => booksForCollection)
    })
  }

  addBooksToCollections(collectionIds: string[], bookIds: string[]) {
    return Promise.all([
      collectionIds.map(id => this.addBooksToCollection(id, bookIds)),
    ])
  }

  removeBooksFromCollection(id: string, bookIds: string[]) {
    return this.findCollectionById(id).then(collection => {
      const booksForCollection = collection.books.filter(
        bookId => !bookIds.includes(bookId)
      )
      return this.collections
        .update(id, {
          books: booksForCollection,
        } as Collection)
        .then(() => bookIds)
    })
  }

  addCollectionsToBook(id: string, collectionIds: string[]) {
    return this.findBookById(id).then(book => {
      const collectionsForBook = [...collectionIds, ...book.collections]
      return this.books
        .update(id, {
          collections: unique(collectionsForBook),
        } as Book)
        .then(() => collectionsForBook)
    })
  }

  addCollectionsToBooks(bookIds: string[], collectionIds: string[]) {
    return Promise.all([
      bookIds.map(id => this.addCollectionsToBook(id, collectionIds)),
    ])
  }

  removeCollectionsFromBook(id: string, collectionIds: string[]) {
    return this.findBookById(id).then(book => {
      const collectionsForBook = book.collections.filter(
        collectionId => !collectionIds.includes(collectionId)
      )
      return this.books
        .update(id, {
          collections: collectionsForBook,
        } as Book)
        .then(() => collectionIds)
    })
  }
}
