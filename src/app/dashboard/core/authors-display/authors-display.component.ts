import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { removeSpaces } from 'utils/helpers'
import { MAX_BOOKS_DISPLAY, MAX_BOOKS_DISPLAY_LIST } from 'utils/constants'
import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Author } from 'models/author.model'

@Component({
  moduleId: module.id,
  selector: 'authors-display',
  templateUrl: 'authors-display.component.html',
  styleUrls: ['authors-display.component.scss'],
})
export class AuthorsDisplayComponent implements OnInit {
  @Input() authors: Author[]
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() cardsInRow = 4
  @Input() maxAuthors: number
  @Input() fullSearchBar = false
  @Input() tilesDisplay = true

  @Output() onClick = new EventEmitter<Author>()

  searchInput = new FormControl()
  displayAll = false
  selectedAll = false
  page = 1
  pageCount = 1
  immutableMaxAuthors = false
  searchValue: string
  removeSpaces = removeSpaces

  ngOnInit() {
    if (this.maxAuthors) {
      this.immutableMaxAuthors = true
    } else {
      this.maxAuthors = MAX_BOOKS_DISPLAY
    }

    this.pageCount = Math.ceil((this.authors || []).length / this.maxAuthors)
    this.searchInput.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(value => (this.searchValue = value))
  }

  toggleTilesDisplay() {
    this.tilesDisplay = !this.tilesDisplay
    if (!this.immutableMaxAuthors) {
      this.maxAuthors = this.tilesDisplay
        ? MAX_BOOKS_DISPLAY
        : MAX_BOOKS_DISPLAY_LIST
    }
  }
}
