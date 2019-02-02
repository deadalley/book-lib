import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { GoodreadsService } from 'services/goodreads.service'
import { parseBook } from 'utils/helpers'
import { Book } from 'models/book.model'
import { map, mergeMap } from 'rxjs/operators'
import { LibraryService } from 'services/library.service'

@Component({
  moduleId: module.id,
  selector: 'goodreads-search-author',
  templateUrl: 'goodreads-search-author.component.html',
  styleUrls: ['goodreads-search-author.component.css'],
})
export class GoodreadsSearchAuthorComponent implements OnInit {
  form: FormGroup
  books: Book[]
  isLoading = false
  tableItems = {
    Cover: true,
    Author: true,
  }

  constructor(
    private fb: FormBuilder,
    private goodreadsService: GoodreadsService,
    private libraryService: LibraryService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      searchInput: ['', Validators.required],
    })
  }

  submit({ searchInput }) {
    const query = searchInput
    this.goodreadsService.searchBook(query).subscribe(books => {
      this.books = books.map(book => ({
        ...parseBook(book),
        canBeSelected: true,
        isSelected: false,
      }))
    })
  }

  importBooks() {
    const importedBookIds = this.books
      .filter(book => book.isSelected)
      .map(book => book.goodreadsId)
    this.goodreadsService.getBooks(importedBookIds).pipe(
      map(books => books.map(book => parseBook(book))),
      mergeMap(books => this.libraryService.addBooks(books as Book[]))
    )
  }
}
