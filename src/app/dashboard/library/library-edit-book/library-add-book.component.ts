import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Book } from 'models/book.model'
import { Author } from 'models/author.model'
import { ANIMATIONS } from 'utils/constants'
import { cleanFormValues, parseBook, parseAuthor } from 'utils/helpers'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import { LibraryService } from 'services/library.service'
import { GoodreadsService } from 'services/goodreads.service'

@Component({
  moduleId: module.id,
  selector: 'library-add-book',
  templateUrl: 'library-edit-book.component.html',
  styleUrls: ['./library-edit-book.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class LibraryAddBookComponent implements OnInit, OnDestroy {
  form: FormGroup
  allCollections: string[]
  collections: string[]
  genres: string[]
  tags: string[]
  selectedLanguage: string
  book = {} as Book
  author: Author
  title = 'Add new book'
  description = 'Add a new book to your library or wishlist'
  button = 'Add book'
  fromGoodreads = false
  showImage = false
  subscription
  loadingBook = false
  loadingCollections = false
  suggestedBooks: Book[]
  suggestedAuthors: Author[]
  goodreadsId: number
  goodreadsAuthorId: number

  @ViewChild(BookButtonsComponent)
  buttonsComponent: BookButtonsComponent

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService,
    private goodreadsService: GoodreadsService
  ) {
    this.allCollections = []
    this.subscription = this.libraryService.collections$.subscribe(
      collections => {
        if (!collections) {
          return
        }
        this.allCollections = collections.map(collection => collection.title)
      }
    )
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  submit(formValues) {
    const newValues = {
      date: new Date().toISOString().substring(0, 10),
      ...(this.genres.length > 0 && { genres: this.genres }),
      ...(this.tags.length > 0 && { tags: this.tags }),
      ...(this.collections.length > 0 && { collections: this.collections }),
      ...(this.selectedLanguage !== 'Select a language' && {
        language: this.selectedLanguage,
      }),
      ...cleanFormValues(formValues),
      ...this.buttonsComponent.getValues(),
      ...(this.goodreadsAuthorId
        ? { goodreadsAuthorId: this.goodreadsAuthorId }
        : {}),
      ...(this.author ? { goodreadsAuthorId: this.author.id } : {}),
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

  searchBookOnGoodreads(title: string) {
    if (!title) {
      return
    }
    this.goodreadsService.searchBook(books => {
      this.suggestedBooks = books.map(book => parseBook(book))
    }, title)
  }

  selectBook(book: Book) {
    this.goodreadsService.getBook(grBook => {
      book = { ...book, ...parseBook(grBook) }
      this.form.patchValue({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        year: book.year,
        pages: book.pages,
        imageLarge: book.imageLarge,
        imageSmall: book.imageSmall,
      })
      this.goodreadsId = book.goodreadsId
      this.goodreadsAuthorId = book.goodreadsAuthorId
      this.suggestedBooks = []
    }, +book.goodreadsId)
  }

  searchAuthorOnGoodreads(name: string) {
    if (!name) {
      return
    }
    this.goodreadsService.searchAuthor(authors => {
      this.suggestedAuthors = authors.map(author => parseAuthor(author))
    }, name)
  }

  selectAuthor(author: Author) {
    this.author = author
    this.form.patchValue({
      author: author.name,
    })
    this.suggestedAuthors = []
  }
}
