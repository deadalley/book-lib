import { Component, OnInit, OnDestroy } from '@angular/core'
import { Book } from '../../../../interfaces/book'
import { LibraryService } from '../../library/library.service'

@Component({
  moduleId: module.id,
  selector: 'last-added-books',
  templateUrl: 'last-added-books.component.html',
  styleUrls: ['./last-added-books.component.css']
})

export class LastAddedBooksComponent implements OnInit, OnDestroy {
  latestBooks: Book[]
  isLoading = true
  subscription

  constructor(private libraryService: LibraryService) {
    this.subscription = libraryService.getLatestBooks().subscribe((books) => {
      if (!books) { return }
      this.isLoading = false
      this.latestBooks = books
    })
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
