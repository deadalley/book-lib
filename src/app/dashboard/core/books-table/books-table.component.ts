import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'interfaces/book'
import { ANIMATIONS } from 'utils/constans'
import { formatDate } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'books-table',
  templateUrl: 'books-table.component.html',
  styleUrls: ['./books-table.component.css'],
  animations: [ANIMATIONS.CARD]
})

export class BooksTableComponent implements OnInit {
  @Input() sectionTitle: string
  @Input() description: string
  @Input() books: Book[]

  @Input() withButtons: boolean
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() selectable: boolean

  @Input() selectBtnContent: string
  @Input() selectBtnContentDisabled: string

  @Output() selectedBooks = new EventEmitter<Array<Book>>()
  @Output() selectedBook = new EventEmitter<Book>()

  formatDate = formatDate

  ngOnInit() { }

  updateSelectedBooks(selectedBook: Book) {
    this.selectedBook.emit(selectedBook)
    this.selectedBooks.emit(this.books.filter((book) => book.isSelected))
  }

  authorRoute(book: Book) {
    return book.goodreadsAuthorId
      ? `/dashboard/library/authors/${book.goodreadsAuthorId}`
      : `/dashboard/library/authors/find/${book.author}`
  }
}
