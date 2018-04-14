import { Component, OnInit, Input } from '@angular/core'
import CollectionFactory from '../../../../../factories//collection'
import { Collection } from '../../../../../interfaces/collection'

@Component({
  moduleId: module.id,
  selector: 'library-collections',
  templateUrl: 'library-collections.component.html',
  styleUrls: [ ]
})

export class LibraryCollectionsComponent implements OnInit {
  collections: Collection[]

  constructor() { }

  ngOnInit() {
    this.collections = CollectionFactory.buildList(3)
  }

  getBooksByIds(ids) {
    return []
  }
}
