import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'models/book.model'
import { formatDate } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'
import { LibraryService } from 'services/library.service'
import { Router, ActivatedRoute } from '@angular/router'

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

  @Output() selectedChanged = new EventEmitter<Book>()
  @Output() onClick = new EventEmitter<Book>()

  formatDate = formatDate

  constructor(
    private libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  authorRoute() {
    return this.book.goodreadsAuthorId
      ? this.router.navigate(
          [`/dashboard/authors/${this.book.goodreadsAuthorId}`],
          { relativeTo: this.route }
        )
      : this.router.navigate(['/dashboard/authors/find'], {
          relativeTo: this.route,
          queryParams: { name: this.book.author },
        })
  }

  select() {
    if (!(this.selectable || this.clickable)) {
      return
    }
    this.book.isSelected = !this.book.isSelected
    this.selectedChanged.emit(this.book)
  }

  updateFavoriteIcon(values: {}) {
    this.libraryService.updateBook({ ...this.book, ...values }, false)
  }
}
