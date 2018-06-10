import { Component, OnInit, ViewChild, trigger, transition, style, animate, state, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import { Book } from 'interfaces/book'
import { Author } from 'interfaces/author'
import Languages from 'utils/languages'
import { cleanFormValues, parseBook, parseAuthor } from 'utils/helpers'
import { LibraryService } from '../library.service'
import { Router, ActivatedRoute } from '@angular/router'
import { GoodreadsService } from 'services/goodreads.service'

@Component({
  moduleId: module.id,
  selector: 'library-edit-book',
  templateUrl: 'library-edit-book.component.html',
  styleUrls: ['./library-edit-book.component.css'],
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

export class LibraryEditBookComponent implements OnInit, OnDestroy {
  form: FormGroup
  allCollections: string[]
  collections: string[]
  languages: string[]
  genres: string[]
  tags: string[]
  selectedLanguage: string
  book = { } as Book
  author: Author
  title = 'Edit book'
  description = 'Edit book'
  button = 'Update book'
  fromGoodreads = false
  showImage = true
  subscriptions = []
  isLoading = true
  suggestedBooks: Book[]
  suggestedAuthors: Author[]
  goodreadsId: number
  goodreadsAuthorId: number

  @ViewChild(BookButtonsComponent)
  buttonsComponent: BookButtonsComponent

  get bookId(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 2]
  }

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService,
    private goodreadsService: GoodreadsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
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

    this.subscriptions.push(this.libraryService.findBook(this.bookId).subscribe((book) => {
      if (!book) { return }
      this.book = book
      this.collections = this.book.collections ? this.book.collections : []
      if (!this.book.collections) { this.isLoading = false }

      this.subscriptions.push(this.libraryService.collections$.subscribe((collections) => {
        if (!collections) { return }
        this.isLoading = false
        this.allCollections = collections
                                .filter((collection) => !this.collections.includes(collection.title))
                                .map((collection) => collection.title)
      }))

      if (this.book.goodreadsAuthorId) {
        this.goodreadsService.getAuthor((author) => {
          this.author = parseAuthor(author)
        }, this.book.goodreadsAuthorId)
      }

      this.form.patchValue({
        title: this.book.title,
        original: this.book.original,
        author: this.book.author,
        publisher: this.book.publisher,
        year: this.book.year,
        pages: this.book.pages,
        notes: this.book.notes,
        image_large: this.book.image_large,
        image_small: this.book.image_small,
        rating: this.book.rating
      })

      this.languages = Languages
      this.genres = this.book.genres ? this.book.genres : []
      this.tags = this.book.tags ? this.book.tags : []
      this.selectedLanguage = this.book.language ? this.book.language : 'Select a language'
    }))
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  submit(formValues) {
    const newValues = {
      genres: this.genres,
      tags: this.tags,
      collections: this.collections,
      ...(this.selectedLanguage !== 'Select a language') && { language: this.selectedLanguage },
      ...cleanFormValues(formValues),
      ...this.buttonsComponent.getValues(),
      ...(this.goodreadsAuthorId ? { goodreadsAuthorId: this.goodreadsAuthorId } : {}),
      ...(this.author ? { goodreadsAuthorId: this.author.id } : {}),
      ...(this.goodreadsId ? { goodreadsId: this.goodreadsId } : {})
    }

    Object.assign(this.book, newValues)

    console.log('Updating book', this.book)

    this.libraryService.updateBook(this.book)
    this.router.navigate(['../../'], { relativeTo: this.route })
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
    if (!title) { return }
    this.goodreadsService.searchBook((books) => {
      this.suggestedBooks = books.map((book) => parseBook(book))
    }, title)
  }

  selectBook(book: Book) {
    this.goodreadsService.getBook((grBook) => {
      book = { ...book, ...parseBook(grBook) }
      this.form.patchValue({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        year: book.year,
        pages: book.pages,
        ...(this.book.image_large ? {} : { image_large: book.image_large }),
        ...(this.book.image_small ? {} : { image_small: book.image_small }),
      })
      this.goodreadsId = book.goodreadsId
      this.goodreadsAuthorId = book.goodreadsAuthorId
      this.suggestedBooks = []
    }, +book.goodreadsId)
  }

  searchAuthorOnGoodreads(name: string) {
    if (!name) { return }
    this.goodreadsService.searchAuthor((authors) => {
      this.suggestedAuthors = authors.map((author) => parseAuthor(author))
    }, name)
  }

  selectAuthor(author: Author) {
    this.author = author
    this.form.patchValue({
      author: author.name
    })
    this.suggestedAuthors = []
  }
}
