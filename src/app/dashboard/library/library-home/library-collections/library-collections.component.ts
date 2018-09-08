import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Collection } from 'interfaces/collection'
import { scrollToAnchor, removeSpaces } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-collections',
  templateUrl: 'library-collections.component.html',
  styleUrls: [],
  animations: [ANIMATIONS.CARD]
})

export class LibraryCollectionsComponent implements OnInit, OnDestroy, AfterViewInit {
  orderingMethod: string
  collections = [] as Collection[]
  selectedCollection = { } as Collection
  isLoading = true
  tilesDisplay = true
  subscriptions = []

  removeSpaces = removeSpaces

  @ViewChild('deleteCollectionModal') modal

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

  confirmDeleteCollection(collection: Collection) {
    this.selectedCollection = collection
    this.modal.openModal()
  }

  deleteCollection() {
    this.libraryService.deleteCollection(this.selectedCollection)
  }
}
