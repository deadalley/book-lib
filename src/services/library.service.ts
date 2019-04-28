import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DatabaseService } from 'services/database.service'
import { Collection as RawCollection } from 'database/models/collection.model'
import { Book as RawBook } from 'database/models/book.model'
import { Book } from 'models/book.model'
import { Collection } from 'models/collection.model'
import { map, mergeMap, filter } from 'rxjs/operators'
import { Observable } from 'rxjs/Observable'
import { omit, compact, uniq } from 'lodash'
import { SessionService } from './session.service'
import { Author } from 'models/author.model'
import { GoodreadsService } from './goodreads.service'
import { parseAuthor } from 'utils/helpers'
import { of } from 'rxjs'
import { notify } from 'utils/notifications'
import { ignoreReturnFor } from 'utils/promise'

@Injectable()
export class LibraryService {
  private MAX_DATE = 4
  private books = new BehaviorSubject<Book[]>(undefined)
  private collections = new BehaviorSubject<Collection[]>(undefined)
  private grAuthorIds = new BehaviorSubject<number[]>(undefined)
  private booksToImport = new BehaviorSubject<Book[]>(undefined)

  private _userRef: string

  books$: Observable<Book[]>
  latestBooks$: Observable<Book[]>
  collections$: Observable<Collection[]>
  authors$: Observable<Author[]>
  grAuthorIds$: Observable<number[]>
  tags$: Observable<string[]>
  genres$: Observable<string[]>
  booksToImport$ = this.booksToImport.asObservable()
  bookCount$: Observable<number>
  collectionCount$: Observable<number>
  authorCount$: Observable<number>

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
    private goodreadsService: GoodreadsService,
    private session: SessionService
  ) {
    this.session.userId$.subscribe(
      userRefFromSession => (this._userRef = userRefFromSession)
    )
    this.loadLibrary()
  }

  mapCollectionTitleToId(book: Book, collections: Collection[]) {
    if (!book.collections || !collections) {
      return []
    }

    return book.collections.map(
      collectionTitle =>
        collections.find(collection => collection.title === collectionTitle).id
    )
  }

  mapCollectionIdToTitle(
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
    this.rawBooks$ = this.session.userId$.pipe(
      filter(userRef => !!userRef),
      mergeMap(userRef => this.database.subscribeToBooksFromUser(userRef)),
      map(books =>
        books.map(book => ({ ...book, collections: book.collections || [] }))
      )
    )
    this.rawCollections$ = this.session.userId$.pipe(
      filter(userRef => !!userRef),
      mergeMap(userRef => this.database.subscribeToCollectionsFromUser(userRef))
    )
    this.tags$ = this.session.userId$.pipe(
      filter(userRef => !!userRef),
      mergeMap(userRef => this.database.subscribeToTagsFromUser(userRef))
    )
    this.genres$ = this.session.userId$.pipe(
      filter(userRef => !!userRef),
      mergeMap(userRef => this.database.subscribeToGenresFromUser(userRef))
    )

    this.books$ = this.rawBooks$
    this.books$.subscribe(this.books)

    this.latestBooks$ = this.session.userId$.pipe(
      filter(userRef => !!userRef),
      mergeMap(userRef =>
        this.database.subscribeToLatestBooks(userRef, this.MAX_DATE)
      )
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

    this.grAuthorIds$ = this.rawBooks$.pipe(
      map(books => uniq(compact(books.map(book => book.goodreadsAuthorId))))
    )
    this.grAuthorIds$.subscribe(this.grAuthorIds)

    this.authors$ = this.grAuthorIds$.pipe(
      mergeMap(ids =>
        ids.length ? this.goodreadsService.getAuthors(ids) : of([])
      ),
      map(authors => authors.map(author => parseAuthor(author)))
    )

    this.bookCount$ = this.session.userId$.pipe(
      filter(userRef => !!userRef),
      mergeMap(userRef => this.database.subscribeToBookCount(userRef))
    )

    this.collectionCount$ = this.session.userId$.pipe(
      filter(userRef => !!userRef),
      mergeMap(userRef => this.database.subscribeToCollectionCount(userRef))
    )

    this.authorCount$ = this.authors$.pipe(map(authors => authors.length))
  }

  addBook(book: Book) {
    book.collections = this.mapCollectionTitleToId(book, this.collections.value)
    return this.database.createBookForUser(this._userRef, book).then(
      ignoreReturnFor(() =>
        notify({
          message: `<strong>${book.title}</strong> succesfully added`,
        })
      )
    )
  }

  addBooks(books: Book[]) {
    return Promise.all(books.map(book => this.addBook(book))).then(
      ignoreReturnFor(() =>
        notify({
          message: `${books.length} books succesfully added`,
        })
      )
    )
  }

  findBook(id: string) {
    return this.rawCollections$.pipe(
      mergeMap(collections =>
        this.books$.pipe(
          map(books => {
            const book = books.find(b => b.id === id)
            if (!book) {
              return book
            }
            book.collections = this.mapCollectionIdToTitle(
              book.collections,
              collections
            )
            return book
          })
        )
      )
    )
  }

  updateBook(book, mapCollections = true) {
    return this.database
      .updateBookForUser(this._userRef, {
        ...book,
        collections: mapCollections
          ? this.mapCollectionTitleToId(book, this.collections.value)
          : book.collections,
      })
      .then(
        ignoreReturnFor(() =>
          notify({
            message: `<strong>${book.title}</strong> succesfully updated`,
          })
        )
      )
      .catch(
        ignoreReturnFor(() =>
          notify({
            message: `<strong>${book.title}</strong> could not be updated`,
          })
        )
      )
  }

  deleteBook(book: Book) {
    return this.database
      .deleteBookForUser(this._userRef, {
        ...omit(book, ['isSelected']),
        collections: this.mapCollectionTitleToId(book, this.collections.value),
      })
      .then(
        ignoreReturnFor(() =>
          notify({
            message: `<strong>${book.title}</strong> succesfully deleted`,
          })
        )
      )
  }

  getLatestBooks() {
    return this.database.subscribeToLatestBooks(this._userRef, this.MAX_DATE)
  }

  addCollection(collection: Collection) {
    return this.database
      .createCollectionForUser(this._userRef, {
        ...collection,
        books: collection.books.map(book => book.id),
      })
      .then(
        ignoreReturnFor(() =>
          notify({
            message: `<strong>${collection.title}</strong> succesfully added`,
          })
        )
      )
  }

  findCollection(id: string) {
    return this.collections$.pipe(
      map(collections => collections.find(collection => collection.id === id))
    )
  }

  updateCollection(collection: Collection) {
    return this.database
      .updateCollectionForUser(this._userRef, {
        ...collection,
        books: collection.books.map(book => book.id),
      })
      .then(
        ignoreReturnFor(() =>
          notify({
            message: `<strong>${collection.title}</strong> succesfully updated`,
          })
        )
      )
  }

  deleteCollection(collection: Collection) {
    return this.database
      .deleteCollectionForUser(this._userRef, {
        ...collection,
        books: collection.books.map(book => book.id),
      })
      .then(
        ignoreReturnFor(() =>
          notify({
            message: `<strong>${collection.title}</strong> succesfully deleted`,
          })
        )
      )
  }

  addBooksToCollection(collection, books) {
    return this.database
      .addBooksToCollection(collection.id, books.map(book => book.id))
      .then(
        ignoreReturnFor(() =>
          notify({
            message: `${books.length} books succesfully added to ${
              collection.title
            }`,
          })
        )
      )
  }

  removeBooksFromCollection(collection, books) {
    return this.database
      .removeBooksFromCollection(collection.id, books.map(book => book.id))
      .then(
        ignoreReturnFor(() =>
          notify({
            message: `${books.length} books succesfully removed from ${
              collection.title
            }`,
          })
        )
      )
  }
}
