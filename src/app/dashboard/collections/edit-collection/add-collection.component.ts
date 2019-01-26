import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Collection } from 'models/collection.model'
import { LibraryService } from 'services/library.service'
import { formatDate } from 'utils/helpers'
import { ANIMATIONS, DEFAULT_TABLE_ITEMS } from 'utils/constants'
import { map } from 'rxjs/operators'

@Component({
  moduleId: module.id,
  selector: 'add-collection',
  templateUrl: 'edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class AddCollectionComponent implements OnInit, OnDestroy {
  form: FormGroup
  collection: Collection
  title = 'Add new collection'
  description = 'Add a new collection to your library'
  button = 'Add collection'
  books = []
  isLoading = false
  isLoadingBooks = true
  displayDelete = false
  formatDate = formatDate
  subscription
  tableItems = { ...DEFAULT_TABLE_ITEMS, Cover: false }

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: '',
    })
    this.loadBooks()
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (!this.subscription) {
      return
    }
    this.subscription.unsubscribe()
  }

  submit(formValues) {
    this.collection = {
      title: formValues.title,
      description: formValues.description,
      books: this.books.filter(book => book.isSelected),
    } as Collection

    console.log('Adding collection', this.collection)
    this.libraryService
      .addCollection(this.collection)
      .then(collection => (this.collection.id = collection.id))

    this.location.back()
  }

  loadBooks() {
    this.libraryService.books$
      .pipe(
        map(books =>
          books.map(book => {
            book.canBeSelected = true
            book.isSelected = false
            return book
          })
        )
      )
      .subscribe(books => {
        if (!books) {
          return
        }
        this.isLoadingBooks = false
        this.books = books
      })
  }
}
