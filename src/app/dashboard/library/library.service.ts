import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { isAfter, subDays } from 'date-fns'
import { DatabaseService } from '../../../services/database.service'
import { User } from '../../../interfaces/user'
import { Book } from '../../../interfaces/book'
import { Collection } from '../../../interfaces/collection'
import * as _ from 'lodash'
import { AuthService } from 'services/auth.service'

@Injectable()
export class LibraryService {
  private MAX_DATE = 7
  private bookOrdering = new BehaviorSubject<string>('no grouping')
  private collectionOrdering = new BehaviorSubject<string>('no grouping')
  private tilesDisplay = new BehaviorSubject<boolean>(true)
  private books = new BehaviorSubject<Book[]>(undefined)
  private latestBooks = new BehaviorSubject<Book[]>(undefined)
  private collections = new BehaviorSubject<Collection[]>(undefined)
  private book = new BehaviorSubject<Book>(undefined)
  private collection = new BehaviorSubject<Collection>(undefined)

  private _owner: User
  private userRef: string

  collectionOrdering$ = this.collectionOrdering.asObservable()
  bookOrdering$ = this.bookOrdering.asObservable()
  tilesDisplay$ = this.tilesDisplay.asObservable()
  collections$ = this.collections.asObservable()
  books$ = this.books.asObservable()
  latestBooks$ = this.latestBooks.asObservable()
  private book$ = this.book.asObservable()
  private collection$ = this.collection.asObservable()

  constructor(private database: DatabaseService, private auth: AuthService) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      this.userRef = user.ref
      this.loadBooks()
      this.loadCollections()
    }

    this.auth.userRef.subscribe((userRef) => {
      if (!userRef || userRef === this.userRef) { return }
      this.userRef = userRef
      this.loadBooks()
      this.loadCollections()
    })
  }

  private mapCollectionTitleToId(book) {
    book.collections = _.compact(this.collections.getValue().map((collection) => {
      if (book.collections.includes(collection.title)) { return collection.id }
    }))
  }

  private loadBooks() {
    this.database.getBooksForUser(this.userRef, (books) => this.books.next(books))
  }

  private loadCollections() {
    this.database.getCollectionsForUser(this.userRef, (collections) => this.collections.next(collections) )
  }

  toggleTilesDisplay(toggle: boolean) {
    this.tilesDisplay.next(toggle)
  }

  setBookOrderingMethod(method: string) {
    this.bookOrdering.next(method)
  }

  setCollectionOrderingMethod(method: string) {
    this.collectionOrdering.next(method)
  }

  addBook(book: Book) {
    if (book.collections) { this.mapCollectionTitleToId(book) }
    this.database.postBookForUser(this.userRef, book)
  }

  addBooks(books: Book[]) {
    books.forEach((book) => this.addBook(book))
  }

  findBook(id: string) {
    this.database.findBookForUserById(this.userRef, id, (book) => this.book.next(book))
    return this.book$
  }

  updateBook(book) {
    if (book.collections) { this.mapCollectionTitleToId(book) }
    this.database.updateBookForUser(this.userRef, book)
  }

  deleteBook(book: Book) {
    this.database.deleteBook(this.userRef, book)
  }

  getLatestBooks() {
    this.database.getLatestBooks(this.userRef, (books) => {
      const filteredBooks = books.filter((book) => isAfter(book.date, subDays(new Date(), this.MAX_DATE)))
      this.latestBooks.next(filteredBooks)
    })
    return this.latestBooks$
  }

  addCollection(collection: Collection) {
    return this.database.postCollectionForUser(this.userRef, {
      owner: '',
      title: collection.title,
      books: collection.books.map((book) => book.id),
      description: collection.description
    })
  }

  findCollection(id: string) {
    this.database.findCollectionById(id, (collection) => this.collection.next(collection))
    return this.collection$
  }

  updateCollection(collection) {
    this.database.updateCollection(collection)
  }

  deleteCollection(collection) {
    this.database.deleteCollection(this.userRef, collection)
  }

  addBooksToCollection(collection, books) {
    this.database.postBooksForCollections(books.map((book) => ({
      id: book.id,
      collections: [collection.id]
    })))

    this.database.postCollectionForBooks(this.userRef, collection.id, books.map((book) => book.id))
  }

  removeBooksFromCollection(collection, books) {
    this.database.deleteBooksFromCollection(books.map((book) => ({
      id: book.id,
      collections: [collection.id]
    })))

    this.database.deleteCollectionFromBooks(this.userRef, collection.id, books.map((book) => book.id))
  }
}
