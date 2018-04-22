import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/observable/from'
import { DatabaseService } from '../../../services/database.service'
import { Book } from '../../../interfaces/book'
import { User } from '../../../interfaces/user'
import { Collection } from '../../../interfaces/collection'

@Injectable()
export class LibraryService {
  private bookOrdering = new BehaviorSubject<string>('title')
  private collectionOrdering = new BehaviorSubject<string>('title')
  private tilesDisplay = new BehaviorSubject<boolean>(true)
  private books = new BehaviorSubject<Book[]>([])
  private collections = new BehaviorSubject<Collection[]>([])

  private _owner: User

  collectionOrdering$ = this.collectionOrdering.asObservable()
  bookOrdering$ = this.bookOrdering.asObservable()
  tilesDisplay$ = this.tilesDisplay.asObservable()
  collections$ = this.collections.asObservable()
  books$ = this.books.asObservable()

  constructor(private database: DatabaseService) {
    this._owner = JSON.parse(localStorage.getItem('user'))
  }

  loadBooks() {
    this.database.getBooksByIds(this._owner.books, (books) => this.books.next(books))
  }

  loadCollections(collections: Collection[]) {
    this.collections.next(collections)
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
    this.database.pushBook(book)
  }

  addCollection(collection: Collection) {
    this.collections.next(this.collections.getValue().concat([collection]))
  }
}
