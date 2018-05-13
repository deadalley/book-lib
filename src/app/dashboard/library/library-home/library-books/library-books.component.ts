import { Component, OnInit, OnDestroy } from '@angular/core'
import { Book } from '../../../../../interfaces/book'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-books',
  templateUrl: 'library-books.component.html',
  styleUrls: [ ]
})

export class LibraryBooksComponent implements OnInit, OnDestroy {
  tilesDisplay = true
  orderingMethod = 'title'
  books: Book[]
  subscriptions = []

  constructor(private libraryService: LibraryService) {
    this.subscriptions.push(libraryService.books$.subscribe((books) => this.books = books as Book[]))
    this.subscriptions.push(libraryService.tilesDisplay$.subscribe((tilesDisplay) => this.tilesDisplay = tilesDisplay))
    this.subscriptions.push(libraryService.bookOrdering$.subscribe((ordering) => this.orderingMethod = ordering))
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
