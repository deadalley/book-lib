import { Component, OnInit } from '@angular/core'
import { GoodreadsService } from 'services/goodreads.service'
import { LibraryService } from 'services/library.service'
import { Book } from 'models/book.model'
import { ANIMATIONS } from 'utils/constants'
import { AuthService } from 'services/auth.service'
import { SessionService } from 'services/session.service'
import { mergeMap, filter, map } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import { parseBook } from 'utils/helpers'
import { Router } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'goodreads-import',
  templateUrl: 'goodreads-import.component.html',
  styleUrls: ['./goodreads-import.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class GoodreadsImportComponent implements OnInit {
  goodreadsId: number
  books: Book[]
  isLoading = true
  hasSelectedBooks = false
  tableDisplayItems = {
    Cover: true,
    Year: false,
    Publisher: false,
    Pages: false,
  }

  constructor(
    private goodreadsService: GoodreadsService,
    private libraryService: LibraryService,
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.sessionService.goodreadsId$.subscribe(id => {
      this.goodreadsId = +id
      if (this.goodreadsId) {
        this.loadBooks()
      } else {
        this.isLoading = false
      }
    })
  }

  ngOnInit() {}

  connectToGoodreads() {
    this.authService.loginGoodreads()
  }

  loadBooks() {
    combineLatest(
      this.sessionService.goodreadsId$.pipe(
        filter(goodreadsId => !!goodreadsId),
        mergeMap(goodreadsId =>
          this.goodreadsService.getBooksForUser(goodreadsId)
        )
      ),
      this.libraryService.books$.pipe(
        map<any, any>(books =>
          books.map(book => book.goodreadsId).filter(id => id)
        )
      )
    )
      .pipe(
        map(([books, userBookGrIds]) => {
          return books
            .map(
              book =>
                ({
                  ...parseBook(book),
                  owned: false,
                  read: false,
                  favorite: false,
                  wishlist: false,
                  date: new Date().toISOString(),
                  isSelected: false,
                } as Book)
            )
            .map(book => ({
              ...book,
              canBeSelected: !userBookGrIds.includes(book.goodreadsId),
            }))
        })
      )
      .subscribe(books => {
        this.books = books
        this.isLoading = false
      })
  }

  updateSelectedBooks() {
    this.hasSelectedBooks = this.books.some(book => book.isSelected)
  }

  selectAll(selection: boolean) {
    this.books.forEach(book => (book.isSelected = selection))
    this.updateSelectedBooks()
  }

  importBooks() {
    this.libraryService
      .addBooks(this.books.filter(book => book.isSelected))
      .then(() => this.router.navigate(['dashboard/books']))
  }
}
