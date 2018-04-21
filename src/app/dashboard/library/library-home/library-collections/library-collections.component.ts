import { Component, OnInit, Input } from '@angular/core'
import { Collection } from '../../../../../interfaces/collection'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-collections',
  templateUrl: 'library-collections.component.html',
  styleUrls: []
})

export class LibraryCollectionsComponent implements OnInit {
  orderingMethod = 'title'
  collections: Collection[]

  constructor(private libraryService: LibraryService) {
    libraryService.collections$.subscribe((collections) => this.collections = collections)
    libraryService.collectionOrdering$.subscribe((ordering) => this.orderingMethod = ordering)
  }

  ngOnInit() { }
}
