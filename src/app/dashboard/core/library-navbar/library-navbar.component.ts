import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { upperCaseFirstLetter } from 'utils/helpers'

import { Book } from 'models/book.model'
import { LibraryService } from 'services/library.service'
import { Author } from 'models/author.model'

@Component({
  moduleId: module.id,
  selector: 'library-navbar',
  templateUrl: 'library-navbar.component.html',
  styleUrls: ['library-navbar.component.css'],
})
export class LibraryNavbarComponent implements OnInit, OnDestroy {
  subscriptions = []
  tilesDisplay = false
  selectedGrouping: string
  selectedFilter: string
  @Input() groupings: string[]
  @Input() filters: string[]
  @Input() addButtonContent: string
  @Input() displayPoweredByGr: boolean
  @Input() type: string

  searchBoxItems = []
  searchBoxProps
  searchBoxSearchProps

  books: Book[]
  authors: Author[]

  get viewQueryParam(): string {
    return this.route.snapshot.queryParamMap.get('view')
  }

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1].split('?')[0]
  }

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private libraryService: LibraryService
  ) {
    this.route.queryParams.subscribe(params => {
      this.selectedGrouping = params['grouping']
        ? upperCaseFirstLetter(params['grouping'])
        : 'No grouping'

      this.selectedFilter = params['filter']
        ? upperCaseFirstLetter(params['filter'])
        : 'No filter'
      this.tilesDisplay = !params['view'] || params['view'] === 'tiles'
    })
  }

  ngOnInit() {
    if (this.type === 'authors') {
      this.libraryService.authors$.subscribe(authors => {
        this.authors = authors
        this.searchBoxItems = authors
        this.searchBoxProps = { main: 'name' }
        this.searchBoxSearchProps = ['name']
      })
    } else {
      this.libraryService.books$.subscribe(books => {
        this.books = books
        this.searchBoxItems = books
        this.searchBoxProps = { main: 'title', sub: 'author' }
        this.searchBoxSearchProps = ['title', 'original', 'author']
      })
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  toggleTilesDisplay() {
    const queryParams: Params = {
      ...this.route.snapshot.queryParams,
      view:
        !this.viewQueryParam || this.viewQueryParam === 'tiles'
          ? 'list'
          : 'tiles',
    }
    this.router.navigate(['.'], { relativeTo: this.route, queryParams })
  }

  setGrouping(grouping: string) {
    const queryParams: Params = {
      ...this.route.snapshot.queryParams,
      grouping:
        grouping === 'No grouping' ? null : grouping.toLocaleLowerCase(),
    }
    this.router.navigate([`.`], {
      relativeTo: this.route,
      queryParams,
    })
  }

  setFilter(filter: string) {
    const queryParams: Params = {
      ...this.route.snapshot.queryParams,
      filter: filter === 'No filter' ? null : filter.toLocaleLowerCase(),
    }
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams,
    })
  }
}
