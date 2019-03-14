import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Book } from 'models/book.model'
import { ANIMATIONS } from 'utils/constants'
import { LibraryService } from 'services/library.service'
import { ActivatedRoute, Router } from '@angular/router'
import { map, mergeMap } from 'rxjs/operators'
import { combineLatest } from 'rxjs/observable/combineLatest'
import { GoodreadsService } from 'services/goodreads.service'
import { parseBook } from 'utils/helpers'
import { Location } from '@angular/common'

@Component({
  moduleId: module.id,
  selector: 'match-book',
  templateUrl: 'match-book.component.html',
  styleUrls: ['./match-book.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class MatchBookComponent implements OnInit {
  @Input() selectedBook: Book
  @Input() libraryBook: Book
  form: FormGroup
  isLoading = true
  inputFields = ['title', 'author', 'publisher', 'year', 'pages']

  get goodreadsId(): string {
    const splitUrl = this.router.url.split('?')[0].split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    private fb: FormBuilder,
    private goodreadsService: GoodreadsService,
    private libraryService: LibraryService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    combineLatest(
      this.goodreadsService.getBook(+this.goodreadsId).pipe(
        map<any, any>(
          book =>
            ({
              ...parseBook(book),
              canBeSelected: true,
              isSelected: true,
            } as Book)
        )
      ),
      this.route.queryParams.pipe(
        map(params => params.libraryBookId),
        mergeMap(id => this.libraryService.findBook(id))
      )
    ).subscribe(([grBook, lbBook]) => {
      this.isLoading = false
      this.selectedBook = grBook as Book
      this.libraryBook = lbBook
      this.form = this.fb.group({
        title: [
          this.libraryBook.title || this.selectedBook.title,
          Validators.required,
        ],
        author: [
          this.libraryBook.author || this.selectedBook.author,
          Validators.required,
        ],
        publisher:
          this.libraryBook.publisher || this.selectedBook.publisher || '',
        year: this.libraryBook.year || this.selectedBook.year || 0,
        pages: this.libraryBook.pages || this.selectedBook.pages || 0,
        cover: this.libraryBook.imageLarge || this.selectedBook.imageLarge || 0,
      })
    })
  }

  return() {
    this.location.back()
  }

  submit(values) {
    const updatedBook = {
      ...this.selectedBook,
      ...this.libraryBook,
      ...this.parseValues(values),
    }
    this.libraryService
      .updateBook(updatedBook)
      .then(() => this.router.navigate(['dashboard/books']))
  }

  parseValues(values) {
    const props = Object.keys(values)
    props.forEach(prop => (values[prop] = values[prop].split('_#')[0]))
    values.year = +values.year
    values.pages = +values.pages
    values.imageLarge = values.cover
    return values
  }
}
