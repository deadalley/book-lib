import { Component, OnInit } from '@angular/core'
import BookFactory from '../../../../factories/book'
import { Book } from '../../../../interfaces/book'

@Component({
  moduleId: module.id,
  selector: 'library-home-cmp',
  templateUrl: 'library-home.component.html',
  styleUrls: []
})

export class LibraryHomeComponent implements OnInit {
  books: Book[]
  tilesDisplay = true

  ngOnInit() {
    this.books = BookFactory.buildList(10)
  }

  toggleTilesDisplay(tilesDisplay: boolean) {
    this.tilesDisplay = tilesDisplay
  }
}
