import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Book } from 'models/book.model'
import { Author } from 'models/author.model'
import { GoodreadsService } from 'services/goodreads.service'
import { LibraryService } from 'services/library.service'
import { parseBook } from 'utils/helpers'
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
    this.goodreadsService.getAuthor(author => {
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

        this.author = {
          id: author.id,
          name: author.name,
          about: author.about,
          books,
          imageSmall: author.small_image_url,
          imageLarge: author.large_image_url
            ? author.large_image_url
            : author.image_url,
          goodreadsLink: author.link,
        }
      }
    }, +this.localUrlPath)
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
        date: new Date().toISOString().substring(0, 10),
      }))
    this.libraryService.addBooks(booksToAdd)
    this.router.navigate(['dashboard/library'])
  }
}
