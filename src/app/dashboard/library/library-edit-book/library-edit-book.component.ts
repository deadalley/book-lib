import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import { Book } from 'models/book.model'
import { Author } from 'models/author.model'
import { cleanFormValues, parseBook, parseAuthor } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'
import { LibraryService } from 'services/library.service'
import { GoodreadsService } from 'services/goodreads.service'
import { mergeMap, map, catchError, tap } from 'rxjs/operators'
@Component({
  moduleId: module.id,
  selector: 'library-edit-book',
  templateUrl: 'library-edit-book.component.html',
  styleUrls: ['./library-edit-book.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class LibraryEditBookComponent implements OnInit, OnDestroy {
  form: FormGroup
  allCollections: string[]
  collections: string[]
  genres: string[]
  tags: string[]
  selectedLanguage: string
  book = {} as Book
  author: Author
  title = 'Edit book'
  description = 'Edit book'
  button = 'Update book'
  fromGoodreads = false
  showImage = true
  subscriptions = []
  loadingBook = true
  loadingCollections = true
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

    this.loadCollections()
    this.loadBook()
  }

  loadCollections() {
    this.subscriptions.push(
      this.libraryService.rawCollections$
        .pipe(
          mergeMap(collections =>
            this.libraryService.rawBooks$.pipe(
              map(books => {
                const book = books.find(b => b.id === this.bookId)
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
        .subscribe(collections => (this.allCollections = collections))
    )
  }

  loadBook() {
    this.subscriptions.push(
      this.libraryService.findBook(this.bookId).subscribe(book => {
        this.book = book
        this.loadingBook = false
        this.collections = this.book.collections || []

        if (this.book.goodreadsAuthorId) {
          this.goodreadsService.getAuthor(author => {
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
          imageLarge: this.book.imageLarge,
          imageSmall: this.book.imageSmall,
          rating: this.book.rating,
        })

        this.genres = this.book.genres || []
        this.tags = this.book.tags || []
        this.selectedLanguage = this.book.language
          ? this.book.language
          : 'Select a language'
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
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
      ...(this.goodreadsAuthorId
        ? { goodreadsAuthorId: this.goodreadsAuthorId }
        : {}),
      ...(this.author ? { goodreadsAuthorId: this.author.id } : {}),
      ...(this.goodreadsId ? { goodreadsId: this.goodreadsId } : {}),
    }

    Object.assign(this.book, newValues)

    console.log('Updating book', this.book)

    this.libraryService.updateBook(this.book)
    this.router.navigate(['../../'], { relativeTo: this.route })
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
        ...(this.book.imageLarge ? {} : { imageLarge: book.imageLarge }),
        ...(this.book.imageSmall ? {} : { imageSmall: book.imageSmall }),
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
