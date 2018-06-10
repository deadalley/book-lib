import { Component, OnInit, OnDestroy } from '@angular/core'
import { LibraryService } from '../../library.service'
import { Book } from 'interfaces/book'
import { ANIMATIONS } from 'utils/constans'

@Component({
  moduleId: module.id,
  selector: 'library-import-file',
  templateUrl: 'library-import-file.component.html',
  styleUrls: ['./library-import-file.component.css'],
  animations: [ANIMATIONS.CARD]
})

export class LibraryImportFileComponent implements OnInit, OnDestroy {
  books = [] as Book[]
  hasSelectedBooks = false
  subscription

  constructor(private libraryService: LibraryService) {
    this.subscription = libraryService.booksToImport$.subscribe((books) => {
      if (!books) { return }
      books.forEach((book) => book.isSelected = true)
      this.hasSelectedBooks = true
      this.books = books
    })
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  updateSelectedBooks() {
    this.hasSelectedBooks = this.books.some((book) => book.isSelected)
  }

  selectAll(selection: boolean) {
    this.books.forEach((book) => book.isSelected = selection)
    this.updateSelectedBooks()
  }

  importBooks() {
    this.books.forEach((book) => book.date = (new Date()).toISOString().substring(0, 10))
    this.libraryService.addBooks(this.books.filter((book) => book.isSelected))
  }
}
