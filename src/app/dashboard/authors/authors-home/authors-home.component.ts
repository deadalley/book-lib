import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Author } from 'models/author.model'
import { Book } from 'models/book.model'
import { GoodreadsService } from 'services/goodreads.service'
import { LibraryService } from 'services/library.service'
import { parseAuthor } from 'utils/helpers'
import { ANIMATIONS, MAX_BOOKS, MAX_BOOKS_LIST } from 'utils/constants'
import { mergeMap, map } from 'rxjs/operators'

@Component({
  moduleId: module.id,
  selector: 'authors-home',
  templateUrl: 'authors-home.component.html',
  styleUrls: [],
  animations: [ANIMATIONS.CARD],
})
export class AuthorsHomeComponent implements OnInit {
  authors: Author[]
  books: Book[]
  isLoading = true
  tilesDisplay = true
  page: number
  pageCount: number
  maxAuthors: number

  constructor(
    private libraryService: LibraryService,
    private goodreadsService: GoodreadsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.libraryService.grAuthorIds$
      .pipe(
        mergeMap(ids => this.goodreadsService.getAuthors(ids)),
        map(authors => authors.map(author => parseAuthor(author)))
      )
      .subscribe(authors => {
        this.isLoading = false
        this.authors = authors
      })
    this.route.queryParams.subscribe(params => {
      this.tilesDisplay = !params['view'] || params['view'] === 'tiles'
      this.page = params['page'] || 1
    })
    this.route.queryParams
      .pipe(
        mergeMap(params =>
          this.libraryService.grAuthorIds$.pipe(
            map(ids => ids.length),
            map(authorCount => {
              const view = params.view || 'tiles'
              const max = view === 'tiles' ? MAX_BOOKS : MAX_BOOKS_LIST
              const pageCount = Math.ceil(authorCount / max)
              return {
                maxAuthors: max,
                pageCount: pageCount === 0 ? 1 : pageCount,
              }
            })
          )
        )
      )
      .subscribe(({ maxAuthors, pageCount }) => {
        this.maxAuthors = maxAuthors
        this.pageCount = pageCount
      })
  }
}
