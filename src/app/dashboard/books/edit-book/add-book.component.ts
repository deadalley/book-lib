import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Book } from 'models/book.model'
import { Author } from 'models/author.model'
import { ANIMATIONS } from 'utils/constants'
import { cleanFormValues } from 'utils/helpers'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import { LibraryService } from 'services/library.service'
import { debounceTime, distinctUntilChanged, last } from 'rxjs/operators'
import { DatabaseService } from 'services/database.service'
import { SessionService } from 'services/session.service'
import { notify } from 'utils/notifications'
import {Subject} from 'rxjs'

@Component({
  moduleId: module.id,
  selector: 'add-book',
  templateUrl: 'edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class AddBookComponent implements OnInit {
  form: FormGroup
  allAuthors: Author[] = []
  allCollections: string[] = []
  allTags: string[] = []
  allGenres: string[] = []
  collections: string[]
  genres: string[]
  tags: string[]
  selectedLanguage: string
  book = {} as Book
  selectedAuthorId = 0
  title = 'Add new book'
  fromGoodreads = false
  loadingBook = false
  loadingCollections = true
  displayDelete = false
  goodreadsId: number
  authorName: string
  authorHasFocus: boolean
  authorFocus = new Subject<boolean>()
  _preventSubmit: boolean

  @ViewChild(BookButtonsComponent, { static: false })
  buttonsComponent: BookButtonsComponent

  set preventSubmit(value) {
    this._preventSubmit = value
  }

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService,
    private databaseService: DatabaseService,
    private sessionService: SessionService
  ) {
    this.libraryService.collections$.subscribe(collections => {
      this.allCollections = collections.map(collection => collection.title)
      this.loadingCollections = false
    })
    this.libraryService.authors$.subscribe(
      authors => (this.allAuthors = authors)
    )
    this.libraryService.tags$.subscribe(tags => (this.allTags = tags))
    this.libraryService.genres$.subscribe(genres => (this.allGenres = genres))
    this.form = this.fb.group({
      title: ['', Validators.required],
      original: '',
      author: ['', Validators.required],
      publisher: '',
      year: [0, Validators.min(0)],
      pages: [0, Validators.min(0)],
      notes: '',
      imageLarge: '',
      imageSmall: '',
      rating: 0,
    })
  }

  ngOnInit() {
    this.collections = []
    this.genres = []
    this.tags = []
    this.selectedLanguage = 'Select a language'

    this.authorFocus
      .pipe(debounceTime(10))
      .subscribe(value => (this.authorHasFocus = value))

    this.form
      .get('author')
      .valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(value => (this.authorName = value))
  }

  selectAuthor(author) {
    this.authorName = author.name
    this.selectedAuthorId = author.id
    this.form.patchValue({ author: author.name })
  }

  enterKeyDown(event, formValues) {
    this._preventSubmit ? event.preventDefault() : this.submit(formValues)
  }

  submit(formValues) {
    const newValues = {
      date: new Date().toISOString(),
      ...(this.genres.length > 0 && { genres: this.genres }),
      ...(this.tags.length > 0 && { tags: this.tags }),
      ...(this.collections.length > 0 && { collections: this.collections }),
      ...(this.selectedLanguage !== 'Select a language' && {
        language: this.selectedLanguage,
      }),
      ...cleanFormValues(formValues),
      ...this.buttonsComponent.getValues(),
      ...(this.selectedAuthorId != null
        ? { goodreadsAuthorId: this.selectedAuthorId }
        : {}),
      ...(this.goodreadsId ? { goodreadsId: this.goodreadsId } : {}),
    }

    Object.assign(this.book, newValues)

    console.log('Adding book', this.book)

    this.libraryService.addBook(this.book)
    this.location.back()
  }

  getGenres(genres: string[]) {
    this.genres = genres
  }

  getTags(tags: string[]) {
    this.tags = tags
  }

  moveCollection(origin, target, index) {
    const collection = origin.splice(index, 1)[0]
    target.push(collection)

    this.allCollections.sort((a, b) => {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    })
  }

  uploadImage(event) {
    this.databaseService
      .uploadBookCover(
        this.sessionService.userId,
        this.book.id,
        event.target.files[0]
      )
      .pipe(last())
      .subscribe(imagePath => {
        notify({ message: 'Cover succesfully updated' })
        this.book.imageLarge = imagePath
        this.form.patchValue({ imageLarge: imagePath, imageSmall: imagePath })
      })
  }
}
