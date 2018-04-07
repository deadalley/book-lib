import { Component, OnInit, Output, ViewChild, EventEmitter, trigger, transition, style, animate, group, state } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import CollectionFactory from '../../../../factories/collection'
import { Collection } from '../../../../interfaces/collection'
import { Book } from '../../../../interfaces/book'
import Languages from '../../../../utils/languages'
import { cleanFormValues } from '../../../../utils/helpers'

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
  allCollections: Collection[]
  collections: Collection[]
  languages: string[]
  genres: string[]
  tags: string[]
  selectedLanguage: string
  book = { } as Book
  fromGoodreads = false

  @ViewChild(BookButtonsComponent)
  buttonsComponent: BookButtonsComponent

  constructor(private fb: FormBuilder) {
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
    this.allCollections = [
      { title: 'Collection 1', books: [], description: '' },
      { title: 'Collection 2', books: [], description: ''  },
      { title: 'Collection 3', books: [], description: ''  }]
    this.collections = []
    this.languages = Languages
    this.genres = []
    this.tags = []
    this.selectedLanguage = 'Select a language'
  }

  addBook(formValues) {
    const newValues = {
      id: 99,
      date: (new Date()).toISOString().substring(0, 10),
      ...(this.genres.length > 0) && { genres: this.genres },
      ...(this.tags.length > 0) && { tags: this.tags },
      ...(this.collections.length > 0) && { collections: this.collections.map((collection) => collection.title) },
      ...(this.selectedLanguage !== 'Select a language') && { language: this.selectedLanguage },
      ...cleanFormValues(formValues),
      ...this.buttonsComponent.getValues()
    }

    Object.assign(this.book, newValues)

    this.collections.forEach((collection) => collection.books.push(this.book.id))

    console.log('Adding book', this.book)
    console.log('Collections', this.collections)
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
      if (a.title < b.title) { return -1 }
      if (a.title > b.title) { return 1 }
      return 0
    })
  }
}
