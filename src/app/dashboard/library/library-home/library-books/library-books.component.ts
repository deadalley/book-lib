import { Component, OnInit, Input } from '@angular/core'
import BookFactory from '../../../../../factories/book'
import { Book } from '../../../../../interfaces/book'

@Component({
  moduleId: module.id,
  selector: 'library-books',
  templateUrl: 'library-books.component.html',
  styleUrls: [ ]
})

export class LibraryBooksComponent implements OnInit {
  @Input() tilesDisplay = true
  books: Book[]

  constructor() { }

  ngOnInit() {
    this.books = BookFactory.buildList(10)
  }
}
