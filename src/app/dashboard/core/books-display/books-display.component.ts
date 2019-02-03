import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'models/book.model'
import { removeSpaces } from 'utils/helpers'
import {
  MAX_BOOKS_DISPLAY,
  DEFAULT_TABLE_ITEMS,
  MAX_BOOKS_DISPLAY_LIST,
} from 'utils/constants'
import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  moduleId: module.id,
  selector: 'books-display',
  templateUrl: 'books-display.component.html',
  styleUrls: ['books-display.component.css'],
})
export class BooksDisplayComponent implements OnInit {
  @Input() books: Book[]

  @Input() withButtons: boolean
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() selectable: boolean
  @Input() bookCardsInRow = 4
  @Input() maxBooks
  @Input() fullSearchBar = false
  @Input() displayBooksInLibraryInfo = false
  @Input() displayOnlySelectedBtn = false

  @Input() tableDisplayItems = DEFAULT_TABLE_ITEMS
  @Input() tilesDisplay = true

  @Output() selectedBooks = new EventEmitter<Book[]>()
  @Output() selectedBook = new EventEmitter<Book>()

  searchInput = new FormControl()
  displayAll = false
  selectedAll = false
  onlySelected = false
  page = 1
  pageCount = 1
  immutableMaxBooks = false
  searchValue
  removeSpaces = removeSpaces

  ngOnInit() {
    if (this.maxBooks) {
      this.immutableMaxBooks = true
    } else {
      this.maxBooks = MAX_BOOKS_DISPLAY
    }

    this.pageCount = Math.ceil(this.books.length / this.maxBooks)
    this.searchInput.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(value => (this.searchValue = value))
  }

  selectAll() {
    this.selectedAll = !this.selectedAll
    this.books.forEach(book => (book.isSelected = this.selectedAll))
    this.selectedBooks.emit(this.books.filter(book => book.isSelected))
  }

  toggleTilesDisplay() {
    this.tilesDisplay = !this.tilesDisplay
    if (!this.immutableMaxBooks) {
      if (this.tilesDisplay) {
        this.maxBooks = MAX_BOOKS_DISPLAY
      } else {
        this.maxBooks = MAX_BOOKS_DISPLAY_LIST
      }
    }
  }
}
