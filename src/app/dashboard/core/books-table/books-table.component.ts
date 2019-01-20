import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'models/book.model'
import { ANIMATIONS } from 'utils/constants'
import { formatDate } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'books-table',
  templateUrl: 'books-table.component.html',
  styleUrls: ['./books-table.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class BooksTableComponent implements OnInit {
  @Input() sectionTitle: string
  @Input() description: string
  @Input() books: Book[]

  @Input() withButtons: boolean
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() selectable: boolean

  @Input() statusIncluded: string
  @Input() statusNotIncluded: string
  @Input() statusCannotBeSelected: string

  @Output() selectedBooks = new EventEmitter<Book[]>()
  @Output() selectedBook = new EventEmitter<Book>()

  formatDate = formatDate

  get hasAuthor() {
    if (!this.books) {
      return
    }
    return this.books.some(book => !!book.author)
  }

  get hasDate() {
    if (!this.books) {
      return
    }
    return this.books.some(book => !!book.date)
  }

  ngOnInit() {}

  updateSelectedBooks(selectedBook: Book) {
    selectedBook.isSelected = !selectedBook.isSelected
    this.selectedBook.emit(selectedBook)
    this.selectedBooks.emit(this.books.filter(book => book.isSelected))
  }

  authorRoute(book: Book) {
    return book.goodreadsAuthorId
      ? `/dashboard/authors/${book.goodreadsAuthorId}`
      : `/dashboard/authors/find/${book.author}`
  }
}
