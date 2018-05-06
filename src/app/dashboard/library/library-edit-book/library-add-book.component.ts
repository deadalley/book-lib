import { Component, OnInit, Output, ViewChild, EventEmitter, trigger, transition, style, animate, group, state } from '@angular/core'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { random } from 'faker'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import { Collection } from '../../../../interfaces/collection'
import { Book } from '../../../../interfaces/book'
import Languages from '../../../../utils/languages'
import { cleanFormValues } from '../../../../utils/helpers'
import { LibraryService } from '../library.service'
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'library-edit-book',
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

export class LibraryAddBookComponent implements OnInit {
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

  @ViewChild(BookButtonsComponent)
  buttonsComponent: BookButtonsComponent

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService,
    private router: Router
  ) {
    this.libraryService.collections$.subscribe((collections) => {
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

  addBook(formValues) {
    const newValues = {
      id: random.uuid(),
      date: (new Date()).toISOString().substring(0, 10),
      ...(this.genres.length > 0) && { genres: this.genres },
      ...(this.tags.length > 0) && { tags: this.tags },
      ...(this.collections.length > 0) && { collections: this.collections },
      ...(this.selectedLanguage !== 'Select a language') && { language: this.selectedLanguage },
      ...cleanFormValues(formValues),
      ...this.buttonsComponent.getValues()
    }

    Object.assign(this.book, newValues)

    // this.collections.forEach((collection) => collection.books.push(this.book))

    console.log('Adding book', this.book)
    // console.log('Collections', this.collections)

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
}
