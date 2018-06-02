import { Component, OnInit, trigger, transition, style, animate, state, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Author } from 'interfaces/author'
import { Book } from 'interfaces/book'
import { GoodreadsService } from 'services/goodreads.service'
import { LibraryService } from '../library.service'
import { parseAuthor } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'library--findauthor',
  templateUrl: 'library-find-author.component.html',
  styleUrls: ['./library-find-author.component.css'],
  animations: [
    trigger('card', [
      state('*', style({
        '-ms-transform': 'translate3D(0px, 0px, 0px)',
        '-webkit-transform': 'translate3D(0px, 0px, 0px)',
        '-moz-transform': 'translate3D(0px, 0px, 0px)',
        '-o-transform': 'translate3D(0px, 0px, 0px)',
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
        transition('void => *', [
          style({opacity: 0,
            '-ms-transform': 'translate3D(0px, 150px, 0px)',
            '-webkit-transform': 'translate3D(0px, 150px, 0px)',
            '-moz-transform': 'translate3D(0px, 150px, 0px)',
            '-o-transform': 'translate3D(0px, 150px, 0px)',
            transform: 'translate3D(0px, 150px, 0px)',
          }),
          animate('0.3s 0s ease-out')
        ])
    ])
  ]
})

export class LibraryFindAuthorComponent implements OnInit, OnDestroy {
  authors = { } as Author[]
  books: Book[]
  selectedAuthor: Author
  isLoading = true
  hasSelectedBooks = false
  subscription

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    private libraryService: LibraryService,
    private goodreadsService: GoodreadsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.goodreadsService.searchAuthor((authors) => {
      this.isLoading = false
      this.authors = authors.map((author) => parseAuthor(author))
    }, this.localUrlPath)

    this.subscription = this.libraryService.books$.subscribe((books) => {
      if (!books) { return }
      this.books = books
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  selectAuthor(author: Author) {
    this.selectedAuthor = author
  }

  updateSelectedBooks(books: Book[]) {
    this.hasSelectedBooks = books.some((book) => book.isSelected)
  }

  updateBooks() {
    const selectedBooks = this.books.filter((book) => book.isSelected)
    const hasGoodreadsAuthorId = selectedBooks.filter((book) => book.goodreadsAuthorId)
    if (hasGoodreadsAuthorId) {
      // open modal
    }
    selectedBooks.forEach((book) => {
      book.goodreadsAuthorId = this.selectedAuthor.id
      book.author = this.selectedAuthor.name
      this.libraryService.updateBook(book)
    })
    this.router.navigate(['dashboard/library'])
  }
}