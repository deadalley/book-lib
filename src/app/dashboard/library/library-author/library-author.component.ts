import { Component, OnInit, Input, Output, EventEmitter, trigger, transition, style, animate, group, state, OnDestroy } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Book } from 'interfaces/book'
import { Author } from 'interfaces/author'
import { Router } from '@angular/router'
import { GoodreadsService } from 'services/goodreads.service'
import { objectToArray, parseBook } from 'utils/helpers'
import * as _ from 'lodash'
import { LibraryService } from '../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-author',
  templateUrl: 'library-author.component.html',
  styleUrls: ['./library-author.component.css'],
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

export class LibraryAuthorComponent implements OnInit, OnDestroy {
  author = { } as Author
  isLoading = true
  hasSelectedBooks = false
  subscription

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    private location: Location,
    private goodreadsService: GoodreadsService,
    private libraryService: LibraryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.goodreadsService.getAuthor((author) => {
      if (author) {
        this.isLoading = false

        const books = author.books.book.map((book) => _.omit(parseBook(book), ['author']))

        this.subscription = this.libraryService.books$.subscribe((ownBooks) => {
          if (!ownBooks) { return }
          books.forEach((book) =>
            book.inLibrary = ownBooks.map((ownBook) => ownBook.goodreadsId).includes(book.goodreadsId))
        })

        this.author = {
          id: author.id,
          name: author.name,
          about: author.about,
          books: books,
          image_small: author.small_image_url,
          image_large: author.large_image_url ? author.large_image_url : author.image_url,
          goodreadsLink: author.link
        }
      }

    }, this.localUrlPath)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  updateSelectedBooks(books: Book[]) {
    this.hasSelectedBooks = books.some((book) => book.isSelected)
  }

  importBooks() {
    // TODO: Add owned, read, favorite
    const booksToAdd = this.author.books
      .filter((book) => book.isSelected)
      .map((book) => ({
        ...(book),
        author: this.author.name,
        owned: false,
        read: false,
        favorite: false,
        date: (new Date()).toISOString().substring(0, 10),
      }))
    this.libraryService.addBooks(booksToAdd)
  }
}
