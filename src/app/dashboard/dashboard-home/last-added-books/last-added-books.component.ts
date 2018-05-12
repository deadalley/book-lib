import { Component, OnInit } from '@angular/core'
import { Book } from '../../../../interfaces/book'
import { LibraryService } from '../../library/library.service'

@Component({
  moduleId: module.id,
  selector: 'last-added-books',
  templateUrl: 'last-added-books.component.html',
  styleUrls: ['./last-added-books.component.css']
})

export class LastAddedBooksComponent implements OnInit {
  latestBooks: Book[]
  isLoading = true

  constructor(libraryService: LibraryService) {
    libraryService.getLatestBooks().subscribe((books) => {
      if (!books) { return }
      this.isLoading = false
      this.latestBooks = books
    })
  }

  ngOnInit() { }
}
