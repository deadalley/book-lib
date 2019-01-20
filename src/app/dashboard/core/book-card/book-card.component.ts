import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'models/book.model'
import { formatDate } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'

@Component({
  selector: 'book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class BookCardComponent implements OnInit {
  @Input() book: Book

  @Input() withButtons: boolean
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() selectable: boolean

  @Input() selectBtnContent: string
  @Input() selectBtnContentDisabled: string

  @Output() selectedChanged = new EventEmitter<Book>()

  formatDate = formatDate

  get authorRoute() {
    return this.book.goodreadsAuthorId
      ? `/dashboard/authors/${this.book.goodreadsAuthorId}`
      : `/dashboard/authors/find/${this.book.author}`
  }

  constructor() {}

  ngOnInit() {}

  select() {
    this.book.isSelected = !this.book.isSelected
    this.selectedChanged.emit(this.book)
  }
}
