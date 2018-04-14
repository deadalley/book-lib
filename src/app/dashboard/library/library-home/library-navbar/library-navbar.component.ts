import { Component, OnInit } from '@angular/core'
import { Router, RoutesRecognized } from '@angular/router'
import { LibraryService } from '../../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-navbar',
  templateUrl: 'library-navbar.component.html',
  styleUrls: ['library-navbar.component.css']
})

export class LibraryNavbarComponent implements OnInit {
  private get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    private router: Router,
    private libraryService: LibraryService
  ) { }

  ngOnInit() { }

  toggleTilesDisplay(toggle) {
    console.log('toggling ', toggle)
    this.libraryService.toggleTilesDisplay(toggle)
  }
}
