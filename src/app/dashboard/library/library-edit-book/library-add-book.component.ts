import { Component, OnInit, ViewChild, trigger, transition, style, animate, state, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import { Book } from 'interfaces/book'
import Languages from 'utils/languages'
import { cleanFormValues, parseBook } from 'utils/helpers'
import { LibraryService } from '../library.service'
import { GoodreadsService } from 'services/goodreads.service'

@Component({
  moduleId: module.id,
  selector: 'library-add-book',
  templateUrl: 'library-edit-book.component.html',
  styleUrls: ['./library-edit-book.component.css'],
  animations: [
    trigger('cardaddbook', [
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

export class LibraryAddBookComponent implements OnInit, OnDestroy {
  form: FormGroup
  allCollections: string[]
  collections: string[]
  languages: string[]
  genres: string[]
  tags: string[]
  selectedLanguage: string
  book = { } as Book
  title = 'Add new book'
  description = 'Add a new book to your library or wishlist'
  button = 'Add book'
  fromGoodreads = false
  showImage = false
  subscription
  isLoading = false
  suggestedBooks: Book[]

  @ViewChild(BookButtonsComponent)
  buttonsComponent: BookButtonsComponent

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService,
    private goodreadsService: GoodreadsService,
    private router: Router
  ) {
    this.subscription = this.libraryService.collections$.subscribe((collections) => {
      if (!collections) { return }
      this.allCollections = collections.map((collection) => collection.title)
    })
    this.form = this.fb.group({
      title: ['', Validators.required],
      original: '',
      author: ['', Validators.required],
      publisher: '',
      year: [0, Validators.min(0)],
      pages: [0, Validators.min(0)],
      notes: '',
      image_large: '',
      image_small: '',
      rating: 0
    })
  }

  ngOnInit() {
    this.collections = []
    this.languages = Languages
    this.genres = []
    this.tags = []
    this.selectedLanguage = 'Select a language'
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  submit(formValues) {
    const newValues = {
      date: (new Date()).toISOString().substring(0, 10),
      ...(this.genres.length > 0) && { genres: this.genres },
      ...(this.tags.length > 0) && { tags: this.tags },
      ...(this.collections.length > 0) && { collections: this.collections },
      ...(this.selectedLanguage !== 'Select a language') && { language: this.selectedLanguage },
      ...cleanFormValues(formValues),
      ...this.buttonsComponent.getValues()
    }

    Object.assign(this.book, newValues)

    console.log('Adding book', this.book)

    this.libraryService.addBook(this.book)
    this.location.back()
  }

  getGenres(genres: Array<string>) {
    this.genres = genres
  }

  getTags(tags: Array<string>) {
    this.tags = tags
  }

  moveCollection(origin, target, index) {
    const collection = origin.splice(index, 1)[0]
    target.push(collection)

    this.allCollections.sort((a, b) => {
      if (a < b) { return -1 }
      if (a > b) { return 1 }
      return 0
    })
  }

  searchBookOnGoodreads(title: string) {
    this.goodreadsService.searchBook((books) => {
      this.suggestedBooks = books.map((book) => parseBook(book))
    }, title)
  }

  selectBook(book: Book) {
    this.form.patchValue({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      year: book.year,
      pages: book.pages,
    })
  }
}
