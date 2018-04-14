import { Component, OnInit } from '@angular/core'
import { Book } from '../../../../../interfaces/book'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-books',
  templateUrl: 'library-books.component.html',
  styleUrls: [ ]
})

export class LibraryBooksComponent implements OnInit {
  tilesDisplay = true
  orderingMethod = 'title'
  orderedItems: any
  books: Book[]

  constructor(private libraryService: LibraryService) {
    libraryService.books$.subscribe((books) => this.books = books)
    libraryService.tilesDisplay$.subscribe((tilesDisplay) => this.tilesDisplay = tilesDisplay)
    libraryService.bookOrdering$.subscribe((ordering) => this.orderingMethod = ordering)
  }

  ngOnInit() { }
}
