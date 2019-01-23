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
import { COLLECTION_GROUPINGS } from 'utils/constants'

@Component({
  moduleId: module.id,
  selector: 'collections-home',
  templateUrl: 'collections-home.component.html',
  styleUrls: ['collections-home.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class CollectionsHomeComponent
  implements OnInit, OnDestroy, AfterViewInit {
  groupingMethod: string
  filterMethod: string
  collections = [] as Collection[]
  selectedCollection = {} as Collection
  isLoading = true
  tilesDisplay = true
  displayAll = {}
  subscriptions = []
  tagFilter: string[]
  collectionGroupings = COLLECTION_GROUPINGS
  tableDisplayItems = {}
  tags = []

  removeSpaces = removeSpaces

  @ViewChild('deleteCollectionModal') modal

  constructor(
    private libraryService: LibraryService,
    private route: ActivatedRoute
  ) {
    this.subscriptions.push(
      this.libraryService.collections$.subscribe(collections => {
        if (!collections) {
          return
        }
        this.isLoading = false
        this.collections = collections
        collections.forEach(collection => {
          this.displayAll[collection.id] = true
        })
      })
    )
    this.subscriptions.push(
      this.libraryService.tags$.subscribe(tags => {
        this.tags = tags
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
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.tilesDisplay = !params['view'] || params['view'] === 'tiles'
        this.groupingMethod = (params['grouping'] || '').split(' ')[0]
        this.filterMethod = (params['filter'] || '').split(' ')[0]
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

  confirmDeleteCollection(collection: Collection) {
    this.selectedCollection = collection
    this.modal.openModal()
  }

  deleteCollection() {
    this.libraryService.deleteCollection(this.selectedCollection)
  }

  getQueryParams(name: string) {
    return (this.route.snapshot.queryParamMap.get(name) || '').split(' ')[0]
  }
}
