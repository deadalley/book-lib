import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Book } from 'interfaces/book'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-books',
  templateUrl: 'library-books.component.html',
  styleUrls: [ ]
})

export class LibraryBooksComponent implements OnInit, OnDestroy {
  tilesDisplay = true
  orderingMethod: string
  allBooks: Book[]
  books: Book[]
  subscriptions = []
  tagFilter: string

  constructor(private libraryService: LibraryService, private route: ActivatedRoute) {
    this.subscriptions.push(libraryService.books$.subscribe((books) => this.allBooks = books as Book[]))
    this.subscriptions.push(libraryService.tilesDisplay$.subscribe((tilesDisplay) => this.tilesDisplay = tilesDisplay))
    this.subscriptions.push(libraryService.bookOrdering$.subscribe((ordering) => this.orderingMethod = ordering))
    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      if (!this.allBooks) { return }
      this.tagFilter = params['tag']

      if (this.tagFilter) {
        this.books = this.allBooks.filter((book) => book.tags && book.tags.includes(this.tagFilter))
      } else { this.books = this.allBooks }
    }))
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
