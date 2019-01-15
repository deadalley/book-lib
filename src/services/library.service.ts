import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { isAfter, subDays } from 'date-fns'
import { DatabaseService } from 'services/database.service'
import { Book as RawBook } from 'database/models/book.model'
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
    this.collections$.subscribe(value => {
      console.log('it do be like that sometimes')
      this.collections.next(value)
    })
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
    console.log('addBook', this.collections.value)
    book.collections = this.mapCollectionTitleToId(book, this.collections.value)
    return this.database.createBookForUser(this._userRef, book)
  }

  addBooks(books: Book[]) {
    books.forEach(book => this.addBook(book))
  }

  findBook(id: string) {
    this.database.findBookById(id).then(book => {
      this.database.getCollectionsForUser(this._userRef).then(collections => {
        this.book.next({
          ...book,
          collections: collections
            .filter(collection => book.collections.includes(collection.id))
            .map(collection => collection.title),
        })
      })
    })
    // this.database.findBookForUserById(this.userRef, id, book =>
    //   this.book.next(book)
    // )
    return this.book$
  }

  updateBook(book) {
    if (book.collections) {
      this.mapCollectionTitleToId(book)
    }
    this.database.updateBookForUser(this._userRef, book)
  }

  deleteBook(book: Book) {
    if (book.collections) {
      this.mapCollectionTitleToId(book)
    }
    this.database.deleteBookForUser(this._userRef, book)
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
    // return Promise.all([
    //   this.database.createCollectionForUser(this.userRef, {
    //     title: collection.title,
    //     books: collection.books.map(book => book.id),
    //     description: collection.description,
    //   }),
    //   // this.addBooksToCollection(collection, collection.books),
    // ]).then(values => {
    //   console.log(values)
    //   return values[0]
    // })
  }

  findCollection(id: string) {
    this.database
      .findCollectionById(id)
      .then(collection => this.collection.next(collection))
    return this.collection$
  }

  updateCollection(collection) {
    this.database.updateCollectionForUser(this._userRef, collection)
  }

  deleteCollection(collection) {
    this.database.deleteCollection(this._userRef, collection)
  }

  addBooksToCollection(collection, books) {
    if (!books.length) {
      return
    }

    this.database.addBooksToCollection(collection.id, books)
    books.forEach(book =>
      this.database.addCollectionsToBook(book.id, [collection])
    )

    // this.database.postBooksForCollections(
    //   books.map(book => ({
    //     id: book.id,
    //     collections: [collection.id],
    //   }))
    // )

    // this.database.postCollectionForBooks(
    //   this.userRef,
    //   collection.id,
    //   books.map(book => book.id)
    // )
  }

  removeBooksFromCollection(collection, books) {
    this.database.removeBooksFromCollection(collection.id, books)

    books.forEach(book =>
      this.database.removeCollectionsFromBook(book.id, [collection])
    )
  }
}
