import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { LibraryService } from 'services/library.service'
import * as _ from 'lodash'

@Component({
  moduleId: module.id,
  selector: 'library-home-cmp',
  templateUrl: 'library-home.component.html',
  styleUrls: [],
})
export class LibraryHomeComponent implements OnInit, OnDestroy {
  tags: string[]
  selectedTag: string
  hasBooks = false
  isLoading = true
  tagsDisplay = false
  subscriptions = []

  constructor(
    libraryService: LibraryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.isLoading = false
    this.hasBooks = true
    // this.subscriptions.push(libraryService.books$.subscribe((books) => {
    //   if (!books) { return }
    //   this.isLoading = false
    //   this.hasBooks = books.length > 0
    //   this.tags = _.uniq(_.flatten(_.compact(books.map((book) => book.tags))))
    // }))
    // this.subscriptions.push(libraryService.tagsDisplay$.subscribe((tagsDisplay) => {
    //   this.tagsDisplay = tagsDisplay
    // }))
    // this.subscriptions.push(this.activatedRoute.queryParams.subscribe(params => {
    //   this.selectedTag = params['tag']
    // }))
  }

  ngOnInit() {}

  ngOnDestroy() {
    // this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  filterBooksForTag(tag: string) {
    const queryParams: Params = {
      ..._.omit(this.activatedRoute.snapshot.queryParams, ['grouping']),
      tag,
    }
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams,
    })
  }
}
