import { Component, OnInit } from '@angular/core'
import BookFactory from '../../../../factories/book'
import CollectionFactory from '../../../../factories/collection'
import { Book } from '../../../../interfaces/book'
import { Collection } from '../../../../interfaces/collection'

@Component({
  moduleId: module.id,
  selector: 'library-home-cmp',
  templateUrl: 'library-home.component.html',
  styleUrls: []
})

export class LibraryHomeComponent implements OnInit {
  books: Book[]
  collections: Collection[]
  tilesDisplay = true

  ngOnInit() {
    this.books = BookFactory.buildList(10)
    this.collections = CollectionFactory.buildList(3)

    this.books.forEach((book) => this.collections[Math.floor(Math.random() * 3)].books.push(book.id))
  }

  toggleTilesDisplay(tilesDisplay: boolean) {
    this.tilesDisplay = tilesDisplay
  }

  getBooksByIds(ids) {
    return this.books.filter((book) => ids.includes(book.id))
  }
}
