import { Component, OnInit, Output, EventEmitter, trigger, transition, style, animate, group, state } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms'
import CollectionFactory from '../../../../factories/collection'
import { Collection } from '../../../../interfaces/collection'
import { Book } from '../../../../interfaces/book'
import Languages from '../../../../utils/languages'

@Component({
  moduleId: module.id,
  selector: 'library-add-book',
  templateUrl: 'library-add-book.component.html',
  styleUrls: ['./library-add-book.component.css'],
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
  collections: Collection[]
  languages: string[]
  genres: string[]
  tags: string[]
  selectedCollection: Collection
  selectedLanguage: string
  book = { } as Book
  fromGoodreads = false

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      original: '',
      author: ['', Validators.required],
      publisher: '',
      year: 0,
      pages: 0,
      notes: '',
      rating: 0
    })
  }

  ngOnInit() {
    this.collections = CollectionFactory.buildList(5)
    this.languages = Languages
    this.genres = []
    this.tags = []
    this.selectedCollection = {
      title: 'Add book to a collection',
      books: []
    }
    this.selectedLanguage = 'Select a language'

    this.book.owned = false
    this.book.read = false
    this.book.favorite = false
  }

  addBook(formValues) {
    Object.keys(formValues).forEach((prop) => {
      if (typeof formValues[prop] !== 'undefined' && formValues[prop]) {
        this.book[prop] = formValues[prop]
      }
    })

    this.book.date = (new Date()).toISOString().substring(0, 10)
    if (this.genres.length > 0) { this.book.genres = this.genres }
    if (this.tags.length > 0) { this.book.tags = this.tags }
    if (this.selectedCollection.title !== 'Add book to collection') {
      this.selectedCollection.books.push(this.book)
    }
    if (this.selectedLanguage !== 'Select a language') {
      this.book.language = this.selectedLanguage
    }
    console.log('Adding book', this.book)
  }

  getGenres(genres: Array<string>) {
    this.genres = genres
  }

  getTags(tags: Array<string>) {
    this.tags = tags
  }
}
