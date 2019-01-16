import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { isAfter, subDays } from 'date-fns'
import { DatabaseService } from 'services/database.service'
import { Collection as RawCollection } from 'database/models/collection.model'
import { Book } from 'models/book.model'
import { Collection } from 'models/collection.model'
import * as _ from 'lodash'
import { map, mergeMap } from 'rxjs/operators'
import { Observable } from 'rxjs'
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
  collections$: Observable<Collection[]>
  // TODO: _tilesDisplay$
  // and then create getters
  tilesDisplay$ = this.tilesDisplay.asObservable()
  tagsDisplay$ = this.tagsDisplay.asObservable()
  // collections$ = this.collections.asObservable()
  // books$ = this.books.asObservable()
  latestBooks$ = this.latestBooks.asObservable()
  booksToImport$ = this.booksToImport.asObservable()
  private book$ = this.book.asObservable()
  private collection$ = this.collection.asObservable()

  set userRef(ref) {
    this._userRef = ref
  }
  set setBooksToImport(books: Book[]) {
    this.booksToImport.next(books)
  }

  constructor(private database: DatabaseService) {}

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
    const booksObservable = this.database.subscribeToBooksFromUser(
      this._userRef
    )
    const collectionsObservable = this.database.subscribeToCollectionsFromUser(
      this._userRef
    )

    this.books$ = collectionsObservable.pipe(
      mergeMap(_collections =>
        booksObservable.pipe(
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

    this.collections$ = booksObservable.pipe(
      mergeMap(_books =>
        collectionsObservable.pipe(
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
    return this.books.value.find(book => book.id === id)
  }

  updateBook(book) {
    return this.database.updateBookForUser(this._userRef, {
      ...book,
      collections: this.mapCollectionTitleToId(book, this.collections.value),
    })
  }

  deleteBook(book: Book) {
    this.database.deleteBookForUser(this._userRef, {
      ...book,
      collections: this.mapCollectionTitleToId(book, this.collections.value),
    })
  }

  getLatestBooks() {
    this.books$.subscribe(books => {
      if (!books) {
        return
      }
      const filteredBooks = this.books
        .getValue()
        .filter(book => isAfter(book.date, subDays(new Date(), this.MAX_DATE)))
        .reverse()

      this.latestBooks.next(filteredBooks.slice(0, 4))
    })
    return this.latestBooks$
  }

  addCollection(collection: Collection) {
    return this.database.createCollectionForUser(this._userRef, {
      ...collection,
      books: collection.books.map(book => book.id),
    })
  }

  findCollection(id: string) {
    return this.collections.value.find(collection => collection.id === id)
  }

  updateCollection(collection) {
    return this.database.updateCollectionForUser(this._userRef, collection)
  }

  deleteCollection(collection) {
    return this.database.deleteCollectionForUser(this._userRef, collection)
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
