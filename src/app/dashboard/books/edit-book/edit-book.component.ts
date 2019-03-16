import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import { Book } from 'models/book.model'
import { Author } from 'models/author.model'
import { cleanFormValues } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'
import { LibraryService } from 'services/library.service'
import {
  mergeMap,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators'
import { DatabaseService } from 'services/database.service'
import { SessionService } from 'services/session.service'
import { combineLatest, Subject } from 'rxjs'
@Component({
  moduleId: module.id,
  selector: 'edit-book',
  templateUrl: 'edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class EditBookComponent implements OnInit, OnDestroy {
  get bookId(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 2]
  }

  set preventSubmit(value) {
    this._preventSubmit = value
  }
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
  title = 'Edit book'
  fromGoodreads = false
  subscriptions = []
  loadingBook = true
  loadingCollections = true
  displayDelete = true
  goodreadsId: number
  authorName: string
  authorHasFocus: boolean
  authorFocus = new Subject<boolean>()
  _preventSubmit: boolean

  @ViewChild(BookButtonsComponent)
  buttonsComponent: BookButtonsComponent
  @ViewChild('imageUpload') imageUpload
  @ViewChild('deleteBookModal') modal

  trigger

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private libraryService: LibraryService,
    private databaseService: DatabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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

    combineLatest(
      this.loadCollections(),
      this.loadBook(),
      this.loadAuthors(),
      this.loadTags(),
      this.loadGenres()
    ).subscribe(([collections, book, authors, tags, genres]) => {
      this.setCollections(collections)
      this.setBook(book)
      this.setAuthors(authors)
      this.setTags(tags)
      this.setGenres(genres)
    })

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

  loadCollections() {
    return this.libraryService.rawCollections$.pipe(
      mergeMap(collections =>
        this.libraryService.rawBooks$.pipe(
          map(books => {
            const book = books.find(b => b.id === this.bookId)
            if (!book) {
              return []
            }
            this.loadingCollections = false
            if (!book.collections) {
              return collections.map(c => c.title)
            }
            return collections
              .filter(c => !book.collections.includes(c.id))
              .map(c => c.title)
          })
        )
      )
    )
  }

  setCollections(collections) {
    this.allCollections = collections
  }

  loadBook() {
    return this.libraryService.findBook(this.bookId)
  }

  setBook(book) {
    this.book = book
    this.loadingBook = false
    this.collections = this.book.collections || []

    this.form.patchValue({
      title: this.book.title,
      original: this.book.original,
      author: this.book.author,
      publisher: this.book.publisher,
      year: this.book.year,
      pages: this.book.pages,
      notes: this.book.notes,
      imageLarge: this.book.imageLarge,
      imageSmall: this.book.imageSmall,
      rating: this.book.rating,
    })

    this.genres = this.book.genres || []
    this.tags = this.book.tags || []
    this.selectedLanguage = this.book.language
      ? this.book.language
      : 'Select a language'
    this.authorName = this.book.author
    this.selectedAuthorId = this.book.goodreadsAuthorId
  }

  loadAuthors() {
    return this.libraryService.authors$
  }

  setAuthors(authors) {
    this.allAuthors = authors
  }

  loadTags() {
    return this.libraryService.tags$
  }

  setTags(tags) {
    if (tags) {
      this.allTags = tags
    }
  }

  loadGenres() {
    return this.libraryService.genres$
  }

  setGenres(genres) {
    if (genres) {
      this.allGenres = genres
    }
  }

  selectAuthor(author) {
    this.authorName = author.name
    this.selectedAuthorId = author.id
    this.form.patchValue({ author: author.name })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  enterKeyDown(event, formValues) {
    this._preventSubmit ? event.preventDefault() : this.submit(formValues)
  }

  submit(formValues) {
    const newValues = {
      genres: this.genres,
      tags: this.tags,
      collections: this.collections,
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

    console.log('Updating book', this.book)

    this.libraryService.updateBook(this.book)
    this.router.navigate(['../../'], { relativeTo: this.route })
  }

  deleteBook() {
    this.libraryService.deleteBook(this.book)
    this.router.navigate(['.'])
  }

  uploadImage(event) {
    this.databaseService
      .uploadBookCover(
        this.sessionService.userId,
        this.book.id,
        event.target.files[0]
      )
      .subscribe(imagePath => {
        this.book.imageLarge = imagePath
        this.form.patchValue({ imageLarge: imagePath, imageSmall: imagePath })
      })
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
}
