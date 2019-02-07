import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { GoodreadsService } from 'services/goodreads.service'
import { parseBook } from 'utils/helpers'
import { Book } from 'models/book.model'
import { map, mergeMap } from 'rxjs/operators'
import { LibraryService } from 'services/library.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'find-book',
  templateUrl: 'find-book.component.html',
  styleUrls: ['find-book.component.css'],
})
export class FindBookComponent implements OnInit {
  form: FormGroup
  books: Book[]
  isLoading = true
  tableItems = {
    Cover: true,
    Author: true,
  }

  constructor(
    private fb: FormBuilder,
    private goodreadsService: GoodreadsService,
    private libraryService: LibraryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(params => params.title),
        mergeMap<any, any>(title => this.goodreadsService.searchBook(title))
      )
      .subscribe(books => {
        this.isLoading = false
        this.books = books.map(book => ({
          ...parseBook(book),
          canBeSelected: true,
          isSelected: false,
        }))
      })
    this.form = this.fb.group({
      searchInput: ['', Validators.required],
    })
  }

  selectBook(book: Book) {
    console.log(book)
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
