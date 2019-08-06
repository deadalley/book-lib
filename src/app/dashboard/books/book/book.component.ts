import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { Book } from 'models/book.model'
import { ANIMATIONS } from 'utils/constants'
import { removeSpaces } from 'utils/helpers'
import { LibraryService } from 'services/library.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'

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

  @ViewChild('deleteBookModal', { static: false }) modal

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    public libraryService: LibraryService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  authorRoute() {
    return this.book.goodreadsAuthorId
      ? this.router.navigate(
          [`/dashboard/authors/${this.book.goodreadsAuthorId}`],
          { relativeTo: this.route }
        )
      : this.router.navigate(['/dashboard/authors/find'], {
          relativeTo: this.route,
          queryParams: { name: this.book.author },
        })
  }

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

  findBookOnGoodreads() {
    this.router.navigate(['dashboard/books/find'], {
      queryParams: { title: this.book.title, libraryBookId: this.book.id },
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
