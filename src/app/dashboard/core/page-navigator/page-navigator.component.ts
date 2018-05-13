import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'page-navigator',
  templateUrl: 'page-navigator.component.html',
  styleUrls: []
})

export class PageNavigatorComponent implements OnInit {
  constructor(public location: Location, private route: ActivatedRoute) { }

  ngOnInit() { }

  scrollToAnchor(location: string, wait: number): void {
    const element = document.querySelector('#' + location)
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
      }, wait)
    }
  }
}
