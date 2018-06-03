import { Component, OnInit, trigger, transition, style, animate, state, OnDestroy } from '@angular/core'
import { Location } from '@angular/common'
import { Book } from 'interfaces/book'
import { LibraryService } from '../library.service'
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'library-book',
  templateUrl: 'library-book.component.html',
  styleUrls: ['./library-book.component.css'],
  animations: [
    trigger('cardbook', [
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

export class LibraryBookComponent implements OnInit, OnDestroy {
  book = { } as Book
  isLoading = true
  subscription

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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.libraryService.findBook(this.localUrlPath).subscribe((book) => {
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

  removeSpaces(title: string) {
    return title.replace(/\s/g, '')
  }
}
