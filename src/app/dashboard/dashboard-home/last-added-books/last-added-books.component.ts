import { Component, OnInit } from '@angular/core'
import { Book } from '../../../../interfaces/book'
import BookFactory from '../../../../factories/book'

@Component({
  moduleId: module.id,
  selector: 'last-added-books',
  templateUrl: 'last-added-books.component.html',
  styleUrls: []
})

export class LastAddedBooksComponent implements OnInit {
  latestBooks: Book[]

  ngOnInit() {
    this.latestBooks = BookFactory.buildList(10)
  }
}
