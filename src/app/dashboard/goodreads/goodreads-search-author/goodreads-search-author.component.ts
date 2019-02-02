import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { GoodreadsService } from 'services/goodreads.service'
import { parseBook, parseAuthor } from 'utils/helpers'
import { map, mergeMap } from 'rxjs/operators'
import { LibraryService } from 'services/library.service'
import { Author } from 'models/author.model'

@Component({
  moduleId: module.id,
  selector: 'goodreads-search-author',
  templateUrl: 'goodreads-search-author.component.html',
  styleUrls: ['goodreads-search-author.component.css'],
})
export class GoodreadsSearchAuthorComponent implements OnInit {
  form: FormGroup
  authors: Author[]
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
    this.goodreadsService.searchAuthor(query).subscribe(authors => {
      this.authors = authors.map(author => parseAuthor(author))
    })
  }

  selectAuthor(author: Author) {
    console.log(author)
  }
}
