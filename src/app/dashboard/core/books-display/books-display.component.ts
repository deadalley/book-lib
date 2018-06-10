import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'interfaces/book'
import { removeSpaces } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'books-display',
  templateUrl: 'books-display.component.html',
  styleUrls: [],
})

export class BooksDisplayComponent implements OnInit {
  @Input() books: Book[]

  @Input() withButtons: boolean
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() selectable: boolean

  @Input() selectBtnContent: string
  @Input() selectBtnContentDisabled: string

  @Output() selectedBooks = new EventEmitter<Array<Book>>()
  @Output() selectedBook = new EventEmitter<Book>()

  tilesDisplay = true
  displayAll = false
  removeSpaces = removeSpaces

  ngOnInit() {
    this.books = []
  }

  selectAll(selection: boolean) {
    this.books.forEach((book) => book.isSelected = selection)
    this.selectedBooks.emit(this.books.filter((book) => book.isSelected))
  }
}
