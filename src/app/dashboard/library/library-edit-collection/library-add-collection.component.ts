import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Collection } from 'interfaces/collection'
import { LibraryService } from 'services/library.service'
import { formatDate } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'

@Component({
  moduleId: module.id,
  selector: 'library-add-collection',
  templateUrl: 'library-edit-collection.component.html',
  styleUrls: ['./library-edit-collection.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class LibraryAddCollectionComponent implements OnInit, OnDestroy {
  form: FormGroup
  collection: Collection
  title = 'Add new collection'
  description = 'Add a new collection to your library'
  button = 'Add collection'
  books = []
  isLoading = false
  isLoadingBooks = true
  formatDate = formatDate
  subscription

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: '',
    })
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
    this.subscription = this.libraryService.books$.subscribe(books => {
      if (!books) {
        return
      }
      this.isLoadingBooks = false
      this.books = books
      this.books.forEach(book => (book.canBeSelected = true))
    })
  }
}
