import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'models/book.model'
import { ANIMATIONS } from 'utils/constants'
import { removeSpaces } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'books-section',
  templateUrl: 'books-section.component.html',
  styleUrls: ['books-section.component.scss'],
  animations: [ANIMATIONS.CARD],
})
export class BooksSectionComponent implements OnInit {
  @Input() sectionId: string
  @Input() sectionTitle: string
  @Input() description: string
  @Input() books: Book[]

  @Input() withButtons: boolean
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() selectable: boolean
  @Input() cardsInRow = 4

  @Output() selectedBooks = new EventEmitter<Book[]>()
  @Output() onClick = new EventEmitter<Book>()

  removeSpaces = removeSpaces
  displayAll = true

  ngOnInit() {}

  updateSelectedBooks() {
    this.selectedBooks.emit(this.books.filter(book => book.isSelected))
  }
}
