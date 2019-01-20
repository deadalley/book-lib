import { Component, OnInit } from '@angular/core'
import { COLLECTION_ORDERINGS } from 'utils/constants'

@Component({
  moduleId: module.id,
  selector: 'collections-cmp',
  templateUrl: 'collections.component.html',
  styleUrls: [],
})
export class CollectionsComponent implements OnInit {
  collectionOrderings = COLLECTION_ORDERINGS

  ngOnInit() {}
}
