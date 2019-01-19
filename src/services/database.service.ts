import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { User } from '../database/models/user.model'
import { Book } from '../database/models/book.model'
import { Collection } from '../database/models/collection.model'
import { objectToArray, findKeyByValue, unique } from '../utils/helpers'
import { environment } from 'environments/environment'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
@Injectable()
export class DatabaseService {
  users: AngularFireList<User>
  books: AngularFireList<Book>
  collections: AngularFireList<Collection>
  isLoggedIn = new BehaviorSubject<boolean>(false)
  rootUrl = '' // environment.name === 'development' ? 'test' : ''

  isLoggedIn$ = this.isLoggedIn.asObservable()

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

  private subscribeTo(
    userRef: string,
    model: string,
    child: string = 'ownerId'
  ) {
    return this.db.list(`${this.rootUrl}/${model}`, ref =>
      ref.orderByChild(child).equalTo(userRef)
    )
  }

  private removeFromUser(collection: AngularFireList<string>, id: string) {
    collection.query.once('value').then(ids => {
      const ref = findKeyByValue(ids, id)
      return collection.remove(ref)
    })
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
    return this.findByParam(key, value, this.users, this.parseUser).then(
      user => user as User
    )
  }

  updateUser(id: string, params: object) {
    this.users.update(id, params as User)
    return this.findUserById(id)
  }

  /** BOOK **/
  private parseBook(book: Book, id: string): Book {
    return {
      ...book,
      id,
      genres: book.genres || [],
      collections: book.collections || [],
      tags: book.tags || [],
    }
  }

  private createBook(book: Book) {
    return this.books
      .push(book)
      .then(res => this.parseBook(book, res.ref.key)) as Promise<Book>
  }

  private getBooksByParam(key: string, value: string) {
    return this.getByParams(key, value, this.books, this.parseBook) as Promise<
      Book[]
    >
  }

  private updateBook(book: Book) {
    return this.books.update(book.id, book).then(() => book)
  }

  private deleteBook(book: Book) {
    return this.books.remove(book.id).then(() => book)
  }

  private removeBookFromUser(userRef: string, id: string) {
    return this.removeFromUser(this.userBooksRef(userRef), id)
  }

  subscribeToBooksFromUser(userRef: string) {
    return this.subscribeTo(userRef, 'books').valueChanges() as Observable<
      Book[]
    >
  }

  subscribeToLatestBooks(userRef: string, limit: number) {
    return this.db
      .list(`${this.rootUrl}/books`, ref =>
        ref
          .orderByChild('ownerId')
          .equalTo(userRef)
          .limitToLast(limit)
      )
      .valueChanges() as Observable<Book[]>
  }

  createBookForUser(userRef: string, book) {
    return this.createBook({ ...book, ownerId: userRef }).then(
      bookInDatabase => {
        return Promise.all([
          this.userBooksRef(userRef).push(bookInDatabase.id),
          ...book.collections.map(collectionId => {
            return this.addBooksToCollection(collectionId, [bookInDatabase.id])
          }),
        ])
          .then(() => this.updateBook(bookInDatabase))
          .then(() => bookInDatabase)
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
        this.updateBook({ ...oldBook, ...book }),
        this.addBooksToCollections(collectionsToAdd, [book.id]),
        this.removeBooksFromCollections(collectionsToRemove, [book.id]),
      ]).then(() => book)
    })
  }

  deleteBookForUser(userRef: string, book: Book) {
    return Promise.all([
      this.deleteBook(book),
      this.removeBookFromUser(userRef, book.id),
      this.removeBooksFromCollections(book.collections, [book.id]),
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
      .then(res => this.parseCollection(collection, res.ref.key)) as Promise<
      Collection
    >
  }

  private getCollectionsByParam(key: string, value: string) {
    return this.getByParams(
      key,
      value,
      this.collections,
      this.parseCollection
    ) as Promise<Collection[]>
  }

  private updateCollection(collection: Collection) {
    return this.collections
      .update(collection.id, collection)
      .then(() => collection)
  }

  private deleteCollection(collection: Collection) {
    return this.collections.remove(collection.id).then(() => collection)
  }

  private removeCollectionFromUser(userRef: string, id: string) {
    return this.removeFromUser(this.userCollectionsRef(userRef), id)
  }

  subscribeToCollectionsFromUser(userRef: string) {
    return this.subscribeTo(
      userRef,
      'collections'
    ).valueChanges() as Observable<Collection[]>
  }

  createCollectionForUser(userRef: string, collection) {
    return this.createCollection({ ...collection, ownerId: userRef }).then(
      collectionInDatabase => {
        return Promise.all([
          this.userCollectionsRef(userRef).push(collectionInDatabase.id),
          ...collectionInDatabase.books.map(bookId =>
            this.addCollectionsToBook(bookId, [collectionInDatabase.id])
          ),
        ])
          .then(() => this.updateCollection(collectionInDatabase))
          .then(() => collectionInDatabase)
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
        this.updateCollection({ ...oldCollection, ...collection }),
        this.addCollectionsToBooks(booksToAdd, [collection.id]),
        this.removeCollectionsFromBooks(booksToRemove, [collection.id]),
      ])
    })
  }

  deleteCollectionForUser(userRef: string, collection: Collection) {
    return Promise.all([
      this.deleteCollection(collection),
      this.removeCollectionFromUser(userRef, collection.id),
      this.removeCollectionsFromBooks(collection.books, [collection.id]),
    ])
  }

  addBooksToCollection(collectionId: string, bookIds: string[]) {
    return this.findCollectionById(collectionId).then(collection => {
      const booksForCollection = [...bookIds, ...collection.books]
      return this.collections
        .update(collectionId, {
          books: unique(booksForCollection),
        } as Collection)
        .then(() => booksForCollection)
    })
  }

  addBooksToCollections(collectionIds: string[], bookIds: string[]) {
    return Promise.all([
      ...collectionIds.map(id => this.addBooksToCollection(id, bookIds)),
    ])
  }

  removeBooksFromCollection(collectionId: string, bookIds: string[]) {
    return this.findCollectionById(collectionId).then(collection => {
      const booksForCollection = collection.books.filter(
        bookId => !bookIds.includes(bookId)
      )
      return this.collections
        .update(collectionId, {
          books: booksForCollection,
        } as Collection)
        .then(() => bookIds)
    })
  }

  removeBooksFromCollections(collectionsIds: string[], bookIds: string[]) {
    return Promise.all([
      ...collectionsIds.map(collectionId =>
        this.removeBooksFromCollection(collectionId, bookIds)
      ),
    ])
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
      ...bookIds.map(id => this.addCollectionsToBook(id, collectionIds)),
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

  removeCollectionsFromBooks(bookIds: string[], collectionIds: string[]) {
    return Promise.all([
      ...bookIds.map(bookId =>
        this.removeCollectionsFromBook(bookId, collectionIds)
      ),
    ])
  }
}
