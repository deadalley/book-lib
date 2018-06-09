import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'interfaces/book'

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
  displayAll = false

  setDisplayAll(value) {
    this.displayAll = true
  }

  ngOnInit() { this.books = [] }

  updateSelectedBooks() {
    this.selectedBooks.emit(this.books.filter((book) => book.isSelected))
  }

  updateSelectedBook(selectedBook: Book) {
    this.selectedBook.emit(selectedBook)
  }

  removeSpaces(title: string) {
    return title.replace(/\s/g, '')
  }
}
