import { Component, OnInit } from '@angular/core'
import { Router, RoutesRecognized } from '@angular/router'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-navbar',
  templateUrl: 'library-navbar.component.html',
  styleUrls: ['library-navbar.component.css']
})

export class LibraryNavbarComponent implements OnInit {
  selectedOrdering: string
  bookOrderings = [
    'Author',
    'Date',
    'Title'
  ]

  collectionOrderings = [
    'Date',
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
  ) { }

  ngOnInit() {
    this.selectedOrdering = 'Title'
  }

  toggleTilesDisplay(toggle) {
    this.libraryService.toggleTilesDisplay(toggle)
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
