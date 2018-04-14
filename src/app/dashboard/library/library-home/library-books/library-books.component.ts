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
    libraryService.books$.subscribe((books) => {
      this.books = books
      this.books.push({
        id: 157,
        title: 'TITLE',
        author: 'AUTHOR',
        owned: true,
        read: true,
        favorite: false,
        date: (new Date()).toISOString()
      })
      this.books.push({
        id: 157,
        title: 'TITLE22',
        author: 'AUTHOR',
        owned: true,
        read: true,
        favorite: false,
        date: (new Date()).toISOString()
      })
    })
    libraryService.tilesDisplay$.subscribe((tilesDisplay) => this.tilesDisplay = tilesDisplay)
    libraryService.bookOrdering$.subscribe((ordering) => {
      this.orderBooks(ordering)
      console.log(this.orderedItems)
      this.orderingMethod = ordering
    })
  }

  ngOnInit() { }

  private orderBooks(ordering) {
    this.orderedItems = { }
    if (ordering === 'title') { return }

    this.books.forEach((book) => {
      if (Object.keys(this.orderedItems).includes(book[ordering])) {
        this.orderedItems[book[ordering]].push(book)
      } else {
        this.orderedItems[book[ordering]] = [book]
      }
    })
  }
}
