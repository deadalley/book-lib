import { Component, OnInit, Output, ViewChild, EventEmitter, trigger, transition, style, animate, group, state, OnDestroy } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Collection } from '../../../../interfaces/collection'
import { LibraryService } from '../library.service'
import { Router } from '@angular/router'
import { formatDate } from '../../../../utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'library-edit-collection',
  templateUrl: 'library-edit-collection.component.html',
  styleUrls: ['./library-edit-collection.component.css'],
  animations: [
    trigger('cardaddbook', [
      state('*', style({
        '-ms-transform': 'translate3D(0px, 0px, 0px)',
        '-webkit-transform': 'translate3D(0px, 0px, 0px)',
        '-moz-transform': 'translate3D(0px, 0px, 0px)',
        '-o-transform': 'translate3D(0px, 0px, 0px)',
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
        transition('void => *', [
          style({opacity: 0,
            '-ms-transform': 'translate3D(0px, 150px, 0px)',
            '-webkit-transform': 'translate3D(0px, 150px, 0px)',
            '-moz-transform': 'translate3D(0px, 150px, 0px)',
            '-o-transform': 'translate3D(0px, 150px, 0px)',
            transform: 'translate3D(0px, 150px, 0px)',
          }),
          animate('0.3s 0s ease-out')
        ])
    ])
  ]
})

export class LibraryEditCollectionComponent implements OnInit, OnDestroy {
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
      description: ''
    })
    this.subscription = this.libraryService.findCollection(this.collectionId).subscribe((collection) => {
      if (!collection) { return }
      this.collection = collection
      this.isLoading = false

      this.form.patchValue({
        title: this.collection.title,
        description: this.collection.description
      })
    })
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    this.bookSubscription.unsubscribe()
  }

  submit(formValues) {
    this.collection = {
      id: this.collection.id,
      title: formValues.title,
      description: formValues.description,
      books: []
    }

    console.log('Updating collection', this.collection)
    this.libraryService.updateCollection(this.collection)

    this.libraryService.addBooksToCollection(
      this.collection,
      this.books.filter((book) => book.inCollection && !book.wasInCollection)
    )
    this.libraryService.removeBooksFromCollection(
      this.collection,
      this.books.filter((book) => !book.inCollection && book.wasInCollection)
    )
    this.location.back()
  }

  loadBooks() {
    this.bookSubscription = this.libraryService.books$.subscribe((books) => {
      if (!books) { return }
      this.isLoadingBooks = false
      this.books = books
      this.books.forEach((book) => {
        book.inCollection = book.collections && book.collections.includes(this.collection.title)
        book.wasInCollection = book.collections && book.collections.includes(this.collection.title)
      })
    })
  }
}
