import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Book } from 'models/book.model'
import { LibraryService } from 'services/library.service'
import { scrollToAnchor } from 'utils/helpers'
import { UiService } from 'services/ui.service'
import { BOOK_GROUPINGS } from 'utils/constants'
import { tap } from 'rxjs/operators'

@Component({
  moduleId: module.id,
  selector: 'books-home',
  templateUrl: 'books-home.component.html',
  styleUrls: [],
})
export class BooksHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  tilesDisplay = true
  groupingMethod: string
  filterMethod: string
  books: Book[] = []
  subscriptions = []
  tagFilter: string[]
  bookGroupings = BOOK_GROUPINGS
  tableDisplayItems = {}
  isLoading = true
  tags = []
  bookCount

  readonly PUSH_GROUPING = {
    genre: 'No genre',
    language: 'No language',
  }

  constructor(
    private libraryService: LibraryService,
    private uiSerivce: UiService,
    private route: ActivatedRoute
  ) {
    this.subscriptions.push(
      this.libraryService.books$.subscribe(books => {
        this.books = books
        this.isLoading = false
      })
    )
    this.subscriptions.push(
      this.libraryService.tags$.subscribe(tags => {
        this.tags = tags
      })
    )
    this.bookCount = this.uiSerivce.bookCount$.pipe(
      tap(value => console.log(value))
    )
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.tilesDisplay = !params['view'] || params['view'] === 'tiles'
        this.groupingMethod = (params['grouping'] || '').split(' ')[0]
        this.filterMethod = (params['filter'] || '').split(' ')[0]
      })
    )
    this.subscriptions.push(
      this.route.fragment.subscribe(fragment => {
        if (!fragment) {
          return
        }
        scrollToAnchor(fragment, 100)
      })
    )

    this.groupingMethod = this.getQueryParams('grouping')
    this.filterMethod = this.getQueryParams('filter')
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.route.snapshot.fragment) {
      scrollToAnchor(this.route.snapshot.fragment, 100)
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  getQueryParams(name: string) {
    return (this.route.snapshot.queryParamMap.get(name) || '').split(' ')[0]
  }
}
