import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'library-navbar',
  templateUrl: 'library-navbar.component.html',
  styleUrls: ['library-navbar.component.css']
})

export class LibraryNavbarComponent implements OnInit {
  @Output() toggleTilesDisplay = new EventEmitter<boolean>()

  constructor(private router: Router) { }

  ngOnInit() { }
}
