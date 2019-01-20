import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Collection } from 'models/collection.model'
import { scrollToAnchor, removeSpaces } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constants'
import { LibraryService } from 'services/library.service'
import { UiService } from 'services/ui.service'

@Component({
  moduleId: module.id,
  selector: 'collections-home',
  templateUrl: 'collections-home.component.html',
  styleUrls: [],
  animations: [ANIMATIONS.CARD],
})
export class CollectionsHomeComponent
  implements OnInit, OnDestroy, AfterViewInit {
  orderingMethod: string
  collections = [] as Collection[]
  selectedCollection = {} as Collection
  isLoading = true
  tilesDisplay = true
  subscriptions = []

  removeSpaces = removeSpaces

  @ViewChild('deleteCollectionModal') modal

  constructor(
    private libraryService: LibraryService,
    private uiService: UiService,
    private route: ActivatedRoute
  ) {
    this.subscriptions.push(
      this.libraryService.collections$.subscribe(collections => {
        if (!collections) {
          return
        }
        this.isLoading = false
        this.collections = collections
      })
    )
    this.subscriptions.push(
      this.uiService.tilesDisplay$.subscribe(
        tilesDisplay => (this.tilesDisplay = tilesDisplay)
      )
    )
    this.subscriptions.push(
      this.route.fragment.subscribe(fragment => {
        if (!fragment) {
          return
        }
        scrollToAnchor(fragment, 100)
      })
    )
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.orderingMethod = params['grouping']
      })
    )
  }

  ngOnInit() {}

  ngAfterViewInit() {
    scrollToAnchor(this.route.snapshot.fragment, 100)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  confirmDeleteCollection(collection: Collection) {
    this.selectedCollection = collection
    this.modal.openModal()
  }

  deleteCollection() {
    this.libraryService.deleteCollection(this.selectedCollection)
  }
}
