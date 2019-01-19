import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DatabaseService } from 'services/database.service'
import { Collection as RawCollection } from 'database/models/collection.model'
import { Book as RawBook } from 'database/models/book.model'
import { Book } from 'models/book.model'
import { Collection } from 'models/collection.model'
import { map, mergeMap, find, takeUntil, takeWhile } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { omit } from 'lodash'
import { SessionService } from './session.service'
@Injectable()
export class LibraryService {
  private MAX_DATE = 7
  private bookOrdering = new BehaviorSubject<string>('no grouping')
  private collectionOrdering = new BehaviorSubject<string>('no grouping')
  private tilesDisplay = new BehaviorSubject<boolean>(true)
  private tagsDisplay = new BehaviorSubject<boolean>(false)
  private books = new BehaviorSubject<Book[]>(undefined)
  private latestBooks = new BehaviorSubject<Book[]>(undefined)
  private collections = new BehaviorSubject<Collection[]>(undefined)
  private book = new BehaviorSubject<Book>(undefined)
  private collection = new BehaviorSubject<Collection>(undefined)
  private booksToImport = new BehaviorSubject<Book[]>(undefined)

  private _userRef: string

  books$: Observable<Book[]>
  latestBooks$: Observable<Book[]>
  collections$: Observable<Collection[]>
  // TODO: _tilesDisplay$
  // and then create getters
  tilesDisplay$ = this.tilesDisplay.asObservable()
  tagsDisplay$ = this.tagsDisplay.asObservable()
  // collections$ = this.collections.asObservable()
  // books$ = this.books.asObservable()
  // latestBooks$ = this.latestBooks.asObservable()
  booksToImport$ = this.booksToImport.asObservable()
  private book$ = this.book.asObservable()
  private collection$ = this.collection.asObservable()

  rawBooks$: Observable<RawBook[]>
  rawCollections$: Observable<RawCollection[]>

  set userRef(ref) {
    this._userRef = ref
  }
  set setBooksToImport(books: Book[]) {
    this.booksToImport.next(books)
  }

  constructor(
    private database: DatabaseService,
    private session: SessionService
  ) {
    this.session.userRef.subscribe(value => {
      this._userRef = value
      if (value) {
        this.loadLibrary()
      }
    })
  }

  private mapCollectionTitleToId(book: Book, collections: Collection[]) {
    if (!book.collections || !collections) {
      return []
    }

    return book.collections.map(
      collectionTitle =>
        collections.find(collection => collection.title === collectionTitle).id
    )
  }

  private mapCollectionIdToTitle(
    collectionIds: string[] = [],
    collections: RawCollection[] = []
  ) {
    return collectionIds.map(
      collection => collections.find(c => c.id === collection).title
    )
  }

  private getBooksForCollection(collectionId: string = '', books: Book[] = []) {
    return books.filter(
      book => book.collections && book.collections.includes(collectionId)
    )
  }

  loadLibrary() {
    console.log('Loading library...')
    this.rawBooks$ = this.database.subscribeToBooksFromUser(this._userRef)
    this.rawCollections$ = this.database.subscribeToCollectionsFromUser(
      this._userRef
    )

    this.books$ = this.rawCollections$.pipe(
      mergeMap(_collections =>
        this.rawBooks$.pipe(
          map(_books =>
            _books.map(
              book =>
                ({
                  ...book,
                  collections: this.mapCollectionIdToTitle(
                    book.collections,
                    _collections
                  ),
                } as Book)
            )
          )
        )
      )
    )
    this.books$.subscribe(this.books)

    this.latestBooks$ = this.database.subscribeToLatestBooks(
      this._userRef,
      this.MAX_DATE
    )

    this.collections$ = this.rawBooks$.pipe(
      mergeMap(_books =>
        this.rawCollections$.pipe(
          map(_collections =>
            _collections.map(collection => ({
              ...collection,
              books: this.getBooksForCollection(collection.id, _books),
            }))
          )
        )
      )
    )
    this.collections$.subscribe(this.collections)
  }

  toggleTilesDisplay(toggle: boolean) {
    this.tilesDisplay.next(toggle)
  }

  toggleTagsDisplay(toggle?: boolean) {
    if (toggle) {
      this.tagsDisplay.next(toggle)
    } else {
      this.tagsDisplay.next(!this.tagsDisplay.getValue())
    }
  }

  // TODO: setters
  setBookOrderingMethod(method: string) {
    this.bookOrdering.next(method)
  }

  setCollectionOrderingMethod(method: string) {
    this.collectionOrdering.next(method)
  }

  addBook(book: Book) {
    book.collections = this.mapCollectionTitleToId(book, this.collections.value)
    return this.database.createBookForUser(this._userRef, book)
  }

  addBooks(books: Book[]) {
    books.forEach(book => this.addBook(book))
  }

  findBook(id: string) {
    return this.books$.pipe(map(books => books.find(book => book.id === id)))
  }

  updateBook(book) {
    return this.database.updateBookForUser(this._userRef, {
      ...book,
      collections: this.mapCollectionTitleToId(book, this.collections.value),
    })
  }

  deleteBook(book: Book) {
    this.database.deleteBookForUser(this._userRef, {
      ...omit(book, ['isSelected']),
      collections: this.mapCollectionTitleToId(book, this.collections.value),
    })
  }

  getLatestBooks() {
    return this.database.subscribeToLatestBooks(this._userRef, this.MAX_DATE)
  }

  addCollection(collection: Collection) {
    return this.database.createCollectionForUser(this._userRef, {
      ...collection,
      books: collection.books.map(book => book.id),
    })
  }

  findCollection(id: string) {
    return this.collections$.pipe(
      map(collections => collections.find(collection => collection.id === id))
    )
  }

  updateCollection(collection: Collection) {
    return this.database.updateCollectionForUser(this._userRef, {
      ...collection,
      books: collection.books.map(book => book.id),
    })
  }

  deleteCollection(collection: Collection) {
    return this.database.deleteCollectionForUser(this._userRef, {
      ...collection,
      books: collection.books.map(book => book.id),
    })
  }

  addBooksToCollection(collection, books) {
    return this.database.addBooksToCollection(
      collection.id,
      books.map(book => book.id)
    )
  }

  removeBooksFromCollection(collection, books) {
    return this.database.removeBooksFromCollection(
      collection.id,
      books.map(book => book.id)
    )
  }
}
