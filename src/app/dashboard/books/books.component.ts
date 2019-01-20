import { Component, OnInit } from '@angular/core'
import { BOOK_ORDERINGS } from 'utils/constants'

@Component({
  moduleId: module.id,
  selector: 'books-cmp',
  templateUrl: 'books.component.html',
  styleUrls: [],
})
export class BooksComponent implements OnInit {
  bookOrderings = BOOK_ORDERINGS

  ngOnInit() {}
}
