import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { scrollToAnchor } from 'utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'page-navigator',
  templateUrl: 'page-navigator.component.html',
  styleUrls: []
})

export class PageNavigatorComponent implements OnInit {
  scrollToAnchor = scrollToAnchor

  constructor(public location: Location, private route: ActivatedRoute) { }

  ngOnInit() { }
}
