import { Component, OnInit } from '@angular/core'
import { LibraryService } from '../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-home-cmp',
  templateUrl: 'library-home.component.html',
  styleUrls: []
})

export class LibraryHomeComponent implements OnInit {
  hasBooks = false

  constructor(libraryService: LibraryService) {
    libraryService.books$.subscribe((books) => {
      if (!books) { return }
      return this.hasBooks = books.length > 0
    })
   }

  ngOnInit() { }
}
