import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'interfaces/book'
import { ANIMATIONS } from 'utils/constants'
import { removeSpaces } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'books-section',
  templateUrl: 'books-section.component.html',
  styleUrls: [],
  animations: [ANIMATIONS.CARD]
})

export class BooksSectionComponent implements OnInit {
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

  removeSpaces = removeSpaces

  ngOnInit() { }

  updateSelectedBooks(selectedBook: Book) {
    this.selectedBook.emit(selectedBook)
    this.selectedBooks.emit(this.books.filter((book) => book.isSelected))
  }
}
