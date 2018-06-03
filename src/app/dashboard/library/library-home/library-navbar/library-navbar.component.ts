import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-navbar',
  templateUrl: 'library-navbar.component.html',
  styleUrls: ['library-navbar.component.css']
})

export class LibraryNavbarComponent implements OnInit, OnDestroy {
  subscription
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
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    public router: Router,
    private libraryService: LibraryService
  ) {
    this.subscription = this.libraryService.tagsDisplay$.subscribe((tagsDisplay) => this.tagsDisplay = tagsDisplay)
  }

  ngOnInit() {
    this.selectedOrdering = 'No grouping'
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  toggleTilesDisplay(toggle) {
    this.libraryService.toggleTilesDisplay(toggle)
  }

  toggleTagsDisplay() {
    this.libraryService.toggleTagsDisplay()
  }

  setOrdering(order: string) {
    this.selectedOrdering = order
    if (this.localUrlPath === 'books') {
      this.libraryService.setBookOrderingMethod(order.toLowerCase())
    } else if (this.localUrlPath === 'collections') {
      this.libraryService.setCollectionOrderingMethod(order.toLowerCase())
    }
  }
}
