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
  private fragment: string

  constructor(private location: Location, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.fragment.subscribe(fragment => { this.fragment = fragment })
  }

  scrollToAnchor(location: string, wait: number): void {
    const element = document.querySelector('#' + location)
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
      }, wait)
    }
  }
}
