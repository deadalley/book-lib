import { Component, OnInit, Input } from '@angular/core'
import { Collection } from '../../../../../interfaces/collection'

@Component({
  moduleId: module.id,
  selector: 'library-collections',
  templateUrl: 'library-collections.component.html',
  styleUrls: [ ]
})

export class LibraryCollectionsComponent implements OnInit {
  @Input() collections: Collection[]

  constructor() { }

  ngOnInit() { }

  getBooksByIds(ids) {
    return []
  }
}
