import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { Router, RoutesRecognized } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'library-navbar',
  templateUrl: 'library-navbar.component.html',
  styleUrls: ['library-navbar.component.css']
})

export class LibraryNavbarComponent implements OnInit {
  @Output() toggleTilesDisplay = new EventEmitter<boolean>()

  private get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(private router: Router) { }

  ngOnInit() { }
}
