import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { Collection } from 'models/collection.model'
import { formatDate } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'
import { LibraryService } from 'services/library.service'

@Component({
  moduleId: module.id,
  selector: 'edit-collection',
  templateUrl: 'edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class EditCollectionComponent implements OnInit, OnDestroy {
  form: FormGroup
  collection: Collection
  title = 'Edit collection'
  description = 'Edit collection'
  button = 'Update collection'
  isLoading = true
  books = []
  isLoadingBooks = true
  formatDate = formatDate
  subscription
  bookSubscription

  get collectionId(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 2]
  }

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: '',
    })

    this.subscription = this.libraryService
      .findCollection(this.collectionId)
      .subscribe(collection => {
        if (!collection) {
          return
        }
        this.collection = collection
        this.isLoading = false

        this.form.patchValue({
          title: this.collection.title,
          description: this.collection.description,
        })
      })
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe()
    if (this.bookSubscription) {
      this.bookSubscription.unsubscribe()
    }
  }

  submit(formValues) {
    this.collection = {
      ...this.collection,
      title: formValues.title,
      description: formValues.description,
      books: this.books.filter(book => book.isSelected),
    }

    this.libraryService.updateCollection(this.collection)
    this.location.back()
  }

  loadBooks() {
    this.bookSubscription = this.libraryService.books$.subscribe(books => {
      if (!books) {
        return
      }
      this.isLoadingBooks = false
      this.books = books
      this.books.forEach(book => {
        book.canBeSelected = true
        book.isSelected =
          book.collections && book.collections.includes(this.collection.title)
        book.wasInCollection =
          book.collections && book.collections.includes(this.collection.title)
      })
    })
  }
}
