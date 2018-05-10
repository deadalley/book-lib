import { Component, OnInit, Input, trigger, transition, style, animate, state } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Collection } from '../../../../../interfaces/collection'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-collections',
  templateUrl: 'library-collections.component.html',
  styleUrls: [],
  animations: [
    trigger('cardbooks', [
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

export class LibraryCollectionsComponent implements OnInit {
  orderingMethod = 'title'
  collections = [] as Collection[]
  selectedCollection = { } as Collection
  isLoading = true

  constructor(private libraryService: LibraryService) {
    libraryService.collections$.subscribe((collections) => {
      if (!collections) { return }
      this.isLoading = false
      this.collections = collections
    })
    libraryService.collectionOrdering$.subscribe((ordering) => this.orderingMethod = ordering)
  }

  ngOnInit() { }

  deleteCollection() {
    this.libraryService.deleteCollection(this.selectedCollection)
  }
}
