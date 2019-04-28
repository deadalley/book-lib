import { Component, OnInit, ViewChild } from '@angular/core'
import { ANIMATIONS, LANGUAGES } from 'utils/constants'
import { ImportService } from 'services/import.service'
import { LibraryService } from 'services/library.service'
import { Router, ActivatedRoute } from '@angular/router'
import { omit } from 'lodash'

@Component({
  moduleId: module.id,
  selector: 'import-cmp',
  templateUrl: 'import.component.html',
  styleUrls: ['./import.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class ImportComponent implements OnInit {
  languages = LANGUAGES
  displayTableInfo = false
  displayAttributesInfo = false
  displayBooksToImport = true
  booksToImport = []
  tableItems = {
    Cover: true,
    'Original title': true,
    Author: true,
    Year: true,
    Publisher: true,
    Language: true,
    Pages: true,
    Rating: true,
  }

  constructor(
    private importService: ImportService,
    private libraryService: LibraryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {}

  uploadFile(event) {
    this.importService.readFile(event.target.files[0]).subscribe(
      books =>
        (this.booksToImport = books.map(book => ({
          ...book,
          canBeSelected: true,
          isSelected: true,
        })))
    )
  }

  importLibrary() {
    this.libraryService.addBooks(
      this.booksToImport
        .filter(book => book.isSelected)
        .map(book => omit(book, ['canBeSelected', 'isSelected']))
    )
  }

  returnToBooks() {
    this.router.navigate(['/dashboard/books'], { relativeTo: this.route })
  }
}
