import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { LibraryService } from '../../library.service'
import { upperCaseFirstLetter } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'library-navbar',
  templateUrl: 'library-navbar.component.html',
  styleUrls: ['library-navbar.component.css']
})

export class LibraryNavbarComponent implements OnInit, OnDestroy {
  subscriptions = []
  tagsDisplay = false
  selectedOrdering: string
  bookOrderings = [
    'No grouping',
    'Author',
    'Date',
    'Genre',
    'Rating',
    'Title',
    'Year'
  ]

  collectionOrderings = [
    'No grouping',
    'Size',
    'Title'
  ]

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1].split('?')[0]
  }

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private libraryService: LibraryService
  ) {
    this.subscriptions.push(this.libraryService.tagsDisplay$.subscribe((tagsDisplay) => this.tagsDisplay = tagsDisplay))
    this.subscriptions.push(this.route.queryParams.subscribe((params) => {
      this.selectedOrdering = params['grouping'] ? upperCaseFirstLetter(params['grouping']) : 'No grouping'
    }))
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  toggleTilesDisplay(toggle) {
    this.libraryService.toggleTilesDisplay(toggle)
  }

  toggleTagsDisplay() {
    this.libraryService.toggleTagsDisplay()
  }

  setOrdering(order: string) {
    if (order === 'No grouping') {
      this.router.navigate(['.'], { relativeTo: this.route })
      return
    }
    const queryParams: Params = { ...this.route.snapshot.queryParams, grouping: order.toLocaleLowerCase() }
    this.router.navigate([`./${this.localUrlPath}`], { relativeTo: this.route, queryParams })
  }
}
