import { Component, OnInit, Input, trigger, transition, style, animate, state, OnDestroy, AfterViewInit } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute } from '@angular/router'
import { Collection } from 'interfaces/collection'
import { LibraryService } from '../../library.service'
import { scrollToAnchor } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'library-collections',
  templateUrl: 'library-collections.component.html',
  styleUrls: [],
  animations: [
    trigger('card', [
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
    ]),
  ]
})

export class LibraryCollectionsComponent implements OnInit, OnDestroy, AfterViewInit {
  orderingMethod: string
  collections = [] as Collection[]
  selectedCollection = { } as Collection
  isLoading = true
  tilesDisplay = true
  subscriptions = []

  constructor(private libraryService: LibraryService, private route: ActivatedRoute) {
    this.subscriptions.push(libraryService.collections$.subscribe((collections) => {
      if (!collections) { return }
      this.isLoading = false
      this.collections = collections
    }))
    this.subscriptions.push(libraryService.tilesDisplay$.subscribe((tilesDisplay) => this.tilesDisplay = tilesDisplay))
    this.subscriptions.push(this.route.fragment.subscribe(fragment => {
      if (!fragment) { return }
      scrollToAnchor(fragment, 100)
    }))
    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      this.orderingMethod = params['grouping']
    }))
  }

  ngOnInit() { }

  ngAfterViewInit() {
    scrollToAnchor(this.route.snapshot.fragment, 100)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  deleteCollection() {
    this.libraryService.deleteCollection(this.selectedCollection)
  }

  removeSpaces(title: string) {
    return title.replace(/\s/g, '')
  }
}
