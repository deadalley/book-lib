import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Collection } from 'interfaces/collection'
import { LibraryService } from '../library.service'
import { formatDate } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constans'

@Component({
  moduleId: module.id,
  selector: 'library-add-collection',
  templateUrl: 'library-edit-collection.component.html',
  styleUrls: ['./library-edit-collection.component.css'],
  animations: [ANIMATIONS.CARD]
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

  constructor(private fb: FormBuilder, private location: Location, private libraryService: LibraryService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ''
    })
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (!this.subscription) { return }
    this.subscription.unsubscribe()
  }

  submit(formValues) {
    this.collection = {
      id: '',
      title: formValues.title,
      description: formValues.description,
      books: []
    }

    console.log('Adding collection', this.collection)
    const id = this.libraryService.addCollection(this.collection)
    this.collection.id = id

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
    this.subscription = this.libraryService.books$.subscribe((books) => {
      if (!books) { return }
      this.isLoadingBooks = false
      this.books = books
    })
  }
}
