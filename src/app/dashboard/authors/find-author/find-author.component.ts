import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Author } from 'models/author.model'
import { Book } from 'models/book.model'
import { GoodreadsService } from 'services/goodreads.service'
import { LibraryService } from 'services/library.service'
import { parseAuthor } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'
import { mergeMap, map } from 'rxjs/operators'

@Component({
  moduleId: module.id,
  selector: 'find-author',
  templateUrl: 'find-author.component.html',
  styleUrls: ['./find-author.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class FindAuthorComponent implements OnInit, OnDestroy {
  authors: Author[] = []
  books: Book[]
  selectedAuthor: Author
  isLoading = true
  hasSelectedBooks = false
  subscription

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    private libraryService: LibraryService,
    private goodreadsService: GoodreadsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(params => params.name),
        mergeMap<any, any>(name => this.goodreadsService.searchAuthor(name))
      )
      .subscribe((authors: Author[]) => {
        this.isLoading = false
        this.authors = authors.map(author => parseAuthor(author))
      })

    this.subscription = this.libraryService.books$.subscribe(books => {
      if (!books) {
        return
      }
      this.books = books.map(book => ({
        ...book,
        isSelected: false,
        canBeSelected: true,
      }))
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  selectAuthor(author: Author) {
    if (this.selectedAuthor) {
      this.selectedAuthor.isSelected = false
    }
    this.selectedAuthor = author
    author.isSelected = true
  }

  updateSelectedBooks(books: Book[]) {
    this.hasSelectedBooks = books.some(book => book.isSelected)
  }

  updateBooks() {
    const selectedBooks = this.books.filter(book => book.isSelected)
    const hasGoodreadsAuthorId = selectedBooks.filter(
      book => book.goodreadsAuthorId
    )
    if (hasGoodreadsAuthorId) {
      // open modal
    }
    selectedBooks.forEach(book => {
      book.goodreadsAuthorId = this.selectedAuthor.id
      book.author = this.selectedAuthor.name
      this.libraryService.updateBook(book)
    })
    this.router.navigate(['/dashboard/books'])
  }
}
