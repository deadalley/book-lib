import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { GoodreadsService } from 'services/goodreads.service'
import { parseBook } from 'utils/helpers'
import { Book } from 'models/book.model'

@Component({
  moduleId: module.id,
  selector: 'goodreads-search-book',
  templateUrl: 'goodreads-search-book.component.html',
  styleUrls: ['goodreads-search-book.component.css'],
})
export class GoodreadsSearchBookComponent implements OnInit {
  form: FormGroup
  books: Book[]
  isLoading = false
  tableItems = {
    Cover: true,
    Author: true,
  }

  constructor(
    private fb: FormBuilder,
    private goodreadsService: GoodreadsService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      searchInput: ['', Validators.required],
    })
  }

  submit({ searchInput }) {
    const query = searchInput
    this.goodreadsService.searchBook(books => {
      console.log(books)
      this.books = books.map(book => ({
        ...parseBook(book),
        canBeSelected: true,
        isSelected: false,
      }))
    }, query)
    console.log(query)
  }
}
