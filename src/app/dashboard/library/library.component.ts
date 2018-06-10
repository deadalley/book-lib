import { Component, OnInit } from '@angular/core'
import { LibraryService } from './library.service'

@Component({
  moduleId: module.id,
  selector: 'library-cmp',
  templateUrl: 'library.component.html',
  styleUrls: []
})

export class LibraryComponent implements OnInit {
  constructor(private libraryService: LibraryService) { }

  ngOnInit() { }
}
