import { Component, OnInit, trigger, transition, style, animate, group, state } from '@angular/core'
import { GoodreadsService } from 'services/goodreads.service'
import { LibraryService } from '../../library/library.service'
import { Book } from 'interfaces/book'

@Component({
  moduleId: module.id,
  selector: 'goodreads-import',
  templateUrl: 'goodreads-import.component.html',
  styleUrls: ['./goodreads-import.component.css'],
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

export class GoodreadsImportComponent implements OnInit {
  goodreadsId: number
  books = [] as Book[]
  isLoading = true
  hasSelectedBooks = false

  constructor(private goodreadsService: GoodreadsService, private libraryService: LibraryService) {
    this.loadBooks()
  }

  ngOnInit() { }

  loadBooks() {
    this.goodreadsService.goodreadsId.subscribe((goodreadsId) => {
      if (!goodreadsId) { return }
      this.goodreadsService.getBooksForUser((books) => {
        if (!books || books.length === 0) { return }

        this.books = books.map((book) => ({
          title: book.title,
          author: book.authors.author.name,
          owned: false,
          read: false,
          favorite: false,
          date: (new Date()).toISOString().substring(0, 10),
          isbn: book.isbn,
          publisher: book.publisher,
          year: book.publication_year,
          pages: book.num_pages,
          image_large: book.large_image_url ? book.large_image_url : book.image_url,
          image_small: book.small_image_url,
          isSelected: true,
          goodreadsLink: book.link,
          goodreadsId: book.id._,
          goodreadsAuthorId: book.authors.author.id
        }))

        this.libraryService.books$.subscribe((userBooks) => {
          if (!userBooks) { return }

          this.isLoading = false
          this.hasSelectedBooks = true
          const grBooks = userBooks.filter((book) => !!book.goodreadsLink).map((book) => book.goodreadsId)
          this.books = this.books.filter((book) => !grBooks.includes(book.goodreadsId))
        })
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
