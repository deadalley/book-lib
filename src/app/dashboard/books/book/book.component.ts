import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { Book } from 'models/book.model'
import { ANIMATIONS } from 'utils/constants'
import { removeSpaces } from 'utils/helpers'
import { LibraryService } from 'services/library.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs/Subscription'

@Component({
  moduleId: module.id,
  selector: 'book',
  templateUrl: 'book.component.html',
  styleUrls: ['./book.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class BookComponent implements OnInit, OnDestroy {
  book = {} as Book
  isLoading = true
  subscription: Subscription

  removeSpaces = removeSpaces

  @ViewChild('deleteBookModal') modal

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  get authorRoute() {
    return this.book.goodreadsAuthorId
      ? `/dashboard/library/authors/${this.book.goodreadsAuthorId}`
      : `/dashboard/library/authors/find/${this.book.author}`
  }

  constructor(
    public libraryService: LibraryService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.libraryService
      .findBook(this.localUrlPath)
      .subscribe(book => {
        if (book) {
          this.isLoading = false
          this.book = book
        }
      })
  }

  deleteBook() {
    this.libraryService.deleteBook(this.book)
    this.location.back()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
