import { Component, OnInit, trigger, transition, style, animate, group, state } from '@angular/core'
import { GoodreadsService } from 'services/goodreads.service'
import { LibraryService } from '../library.service'
import { Book } from 'interfaces/book'

@Component({
  moduleId: module.id,
  selector: 'library-import-goodreads',
  templateUrl: 'library-import-goodreads.component.html',
  styleUrls: ['./library-import-goodreads.component.css'],
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

export class LibraryImportGoodreadsComponent implements OnInit {
  goodreadsId: number
  books = [] as Book[]
  isLoading = true
  hasSelectedBooks = false

  constructor(private goodreadsService: GoodreadsService, private libraryService: LibraryService) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      console.log('Could not find user')
    }

    if (!user.goodreadsId) {
      console.log('User is not connected to Goodreads')
    }

    this.goodreadsId = user.goodreadsId

    this.loadBooks()
  }

  ngOnInit() { }

  loadBooks() {
    this.goodreadsService.getBooksForuser((books) => {
      if (!books || books.length === 0) { return }

      this.books = books.map((book) => ({
        title: book.title,
        author: book.authors.author.name,
        owned: false,
        read: false,
        favorite: false,
        date: (new Date()).toISOString().substring(0, 10),
        isbn: book.isbn,
        publiser: book.publisher,
        year: book.publication_year,
        pages: book.num_pages,
        image_large: book.large_image_url ? book.large_image_url : book.image_url,
        image_small: book.small_image_url,
        isSelected: true,
        goodreadsLink: book.link,
        goodreadsId: book.id._
      }))

      this.libraryService.books$.subscribe((userBooks) => {
        if (!userBooks) { return }

        this.isLoading = false
        this.hasSelectedBooks = true
        const grBooks = userBooks.filter((book) => !!book.goodreadsLink).map((book) => book.goodreadsId)
        this.books = this.books.filter((book) => !grBooks.includes(book.goodreadsId))
      })
    })
  }

  updateSelectedBooks() {
    this.hasSelectedBooks = this.books.some((book) => book.isSelected)
  }

  selectAll(selection: boolean) {
    this.books.forEach((book) => book.isSelected = selection)
    this.updateSelectedBooks()
  }

  importBooks() {
    this.libraryService.addBooks(this.books.filter((book) => book.isSelected))
  }
}