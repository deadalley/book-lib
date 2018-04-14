import { Component, OnInit, Input } from '@angular/core'
import { Book } from '../../../../../interfaces/book'

@Component({
  moduleId: module.id,
  selector: 'library-books',
  templateUrl: 'library-books.component.html',
  styleUrls: [ ]
})

export class LibraryBooksComponent implements OnInit {
  @Input() tilesDisplay = true
  @Input() books: Book[]

  constructor() { }

  ngOnInit() { }
}
