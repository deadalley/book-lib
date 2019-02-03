import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Book } from 'models/book.model'
import { Author } from 'models/author.model'
import { GoodreadsService } from 'services/goodreads.service'
import { LibraryService } from 'services/library.service'
import { parseBook, parseAuthor } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'
import * as _ from 'lodash'

@Component({
  moduleId: module.id,
  selector: 'author',
  templateUrl: 'author.component.html',
  styleUrls: ['./author.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class AuthorComponent implements OnInit, OnDestroy {
  author = {} as Author
  isLoading = true
  hasSelectedBooks = false
  showAllAbout = false
  subscription
  tableDisplayItems = {
    Cover: true,
    Year: false,
    Publisher: false,
    Pages: false,
  }

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    private goodreadsService: GoodreadsService,
    private libraryService: LibraryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.goodreadsService.getAuthor(+this.localUrlPath).subscribe(author => {
      if (author) {
        this.isLoading = false

        const books = author.books.book.map(book =>
          _.omit(parseBook(book), ['author'])
        )

        this.subscription = this.libraryService.books$.subscribe(ownBooks => {
          if (!ownBooks) {
            return
          }
          books.forEach(
            book =>
              (book.canBeSelected = !ownBooks
                .map(ownBook => ownBook.goodreadsId)
                .includes(book.goodreadsId))
          )
        })

        this.author = parseAuthor(author, books)
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  updateSelectedBooks(books: Book[]) {
    this.hasSelectedBooks = books.some(book => book.isSelected)
  }

  importBooks() {
    const booksToAdd = this.author.books
      .filter(book => book.isSelected)
      .map(book => ({
        ...book,
        author: this.author.name,
        owned: false,
        read: false,
        favorite: false,
        wishlist: false,
        date: new Date().toISOString(),
      }))
    this.libraryService.addBooks(booksToAdd)
    this.router.navigate(['dashboard/library'])
  }
}
