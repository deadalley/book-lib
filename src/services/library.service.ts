import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { isAfter, subDays } from 'date-fns'
import { DatabaseService } from 'services/database.service'
import { Book } from 'models/book.model'
import { Collection } from 'models/collection.model'
import * as _ from 'lodash'
import { arrayToObjectWithId } from 'utils/helpers'

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

  private userRef: string

  // TODO: _tilesDisplay$
  // and then create getters
  tilesDisplay$ = this.tilesDisplay.asObservable()
  tagsDisplay$ = this.tagsDisplay.asObservable()
  collections$ = this.collections.asObservable()
  books$ = this.books.asObservable()
  latestBooks$ = this.latestBooks.asObservable()
  booksToImport$ = this.booksToImport.asObservable()
  private book$ = this.book.asObservable()
  private collection$ = this.collection.asObservable()

  set setUserRef(ref) {
    this.userRef = ref
  }
  set setBooksToImport(books: Book[]) {
    this.booksToImport.next(books)
  }

  constructor(private database: DatabaseService) {}

  private mapCollectionTitleToId(book) {
    book.collections = _.compact(
      this.collections.getValue().map(collection => {
        if (book.collections.includes(collection.title)) {
          return collection.id
        }
      })
    )
  }

  loadLibrary() {
    this.books = this.database.getBooksForUser(this.userRef)
    // const collections = await this.database.getCollectionsForUser(this.userRef)
    // const books = await this.database.getBooksForUser(this.userRef)
    // const collectionsObj = arrayToObjectWithId(collections)
    // const mappedBooks = books.map(book => ({
    //   ...book,
    //   collections: book.collections.map(
    //     collectionId => collectionsObj[collectionId].title
    //   ),
    // }))
    // const mappedCollections = collections.map(collection => {
    //   const booksForCollection = books.filter(book =>
    //     book.collections.includes(collection.id)
    //   )
    //   return {
    //     ...collection,
    //     books: booksForCollection,
    //   } as Collection
    // })
    // this.collections.next(mappedCollections)
    // this.books.next(mappedBooks)
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
    if (book.collections) {
      this.mapCollectionTitleToId(book)
    }
    this.database.createBookForUser(this.userRef, book)
  }

  addBooks(books: Book[]) {
    books.forEach(book => this.addBook(book))
  }

  findBook(id: string) {
    this.database.findBookById(id).then(book => {
      this.database.getCollectionsForUser(this.userRef).then(collections => {
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
    this.database.updateBookForUser(this.userRef, book)
  }

  deleteBook(book: Book) {
    if (book.collections) {
      this.mapCollectionTitleToId(book)
    }
    this.database.deleteBookForUser(this.userRef, book)
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
    return this.database.createCollectionForUser(this.userRef, {
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
    this.database.updateCollectionForUser(this.userRef, collection)
  }

  deleteCollection(collection) {
    this.database.deleteCollection(this.userRef, collection)
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
