import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { GoodreadsService } from 'services/goodreads.service'
import { parseBook } from 'utils/helpers'
import { Book } from 'models/book.model'
import { map, mergeMap } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'find-book',
  templateUrl: 'find-book.component.html',
  styleUrls: ['find-book.component.css'],
})
export class FindBookComponent implements OnInit {
  form: FormGroup
  books: Book[]
  selectedBook: Book
  isLoading = true
  tableItems = {
    Cover: true,
    Author: true,
  }

  constructor(
    private fb: FormBuilder,
    private goodreadsService: GoodreadsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(params => params.title),
        mergeMap<any, any>(title => this.goodreadsService.searchBook(title))
      )
      .subscribe((books: Book[]) => {
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
    if (this.selectedBook) {
      this.selectedBook.isSelected = false
    }
    book.isSelected = true
    this.router.navigate([`dashboard/books/import/${book.goodreadsId}`], {
      queryParams: {
        libraryBookId: this.route.snapshot.queryParamMap.get('libraryBookId'),
      },
    })
  }
}
