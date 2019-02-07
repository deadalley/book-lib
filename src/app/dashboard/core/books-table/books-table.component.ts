import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Book } from 'models/book.model'
import { ANIMATIONS } from 'utils/constants'
import { formatDate } from 'utils/helpers'
import { LibraryService } from 'services/library.service'
import { ActivatedRoute, Router } from '@angular/router'

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
  @Input() withDisplayItems: boolean

  @Input() statusIncluded: string
  @Input() statusNotIncluded: string
  @Input() statusCannotBeSelected: string
  @Input() displayItems = {}

  @Output() selectedBooks = new EventEmitter<Book[]>()
  @Output() selectedBook = new EventEmitter<Book>()

  formatDate = formatDate

  constructor(
    private libraryService: LibraryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {}

  updateSelectedBooks(selectedBook: Book) {
    selectedBook.isSelected = !selectedBook.isSelected
    this.selectedBook.emit(selectedBook)
    this.selectedBooks.emit(this.books.filter(book => book.isSelected))
  }

  authorRoute(book: Book) {
    return book.goodreadsAuthorId
      ? this.router.navigate([`/dashboard/authors/${book.goodreadsAuthorId}`], {
          relativeTo: this.route,
        })
      : this.router.navigate(['/dashboard/authors/find'], {
          relativeTo: this.route,
          queryParams: { name: book.author },
        })
  }

  updateFavoriteIcon(book: Book, values: {}) {
    this.libraryService.updateBook({ ...book, ...values })
  }
}
