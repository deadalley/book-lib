import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { Collection } from 'models/collection.model'
import { formatDate } from 'utils/helpers'
import { ANIMATIONS, DEFAULT_TABLE_ITEMS } from 'utils/constants'
import { LibraryService } from 'services/library.service'
import { mergeMap, map } from 'rxjs/operators'

@Component({
  moduleId: module.id,
  selector: 'edit-collection',
  templateUrl: 'edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class EditCollectionComponent implements OnInit, OnDestroy {
  form: FormGroup
  collection = {} as Collection
  title = 'Edit collection'
  description = 'Edit collection'
  button = 'Update collection'
  isLoading = true
  books = []
  isLoadingBooks = true
  displayDelete = true
  formatDate = formatDate
  subscription
  bookSubscription
  tableItems = { ...DEFAULT_TABLE_ITEMS, Cover: false }

  @ViewChild('deleteCollectionModal') modal

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

    this.loadCollection()
    this.loadBooks()
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe()
    if (this.bookSubscription) {
      this.bookSubscription.unsubscribe()
    }
  }

  deleteCollection() {
    this.libraryService.deleteCollection(this.collection)
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

  loadCollection() {
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

  loadBooks() {
    this.libraryService
      .findCollection(this.collectionId)
      .pipe(
        mergeMap(collection =>
          this.libraryService.books$.pipe(
            map(books =>
              books.map(book => {
                book.canBeSelected = true
                book.isSelected =
                  book.collections && book.collections.includes(collection.id)
                return book
              })
            )
          )
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
