import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core'
import { ROUTES } from '../../sidebar/sidebar.component'
import { Router, ActivatedRoute } from '@angular/router'
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common'

@Component({
  moduleId: module.id,
  selector: 'navbar-cmp',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
  private listTitles: any[]
  private nativeElement: Node
  private toggleButton
  private sidebarVisible: boolean

  @ViewChild('navbar-cmp') button

  constructor(location: Location, private router: Router, private renderer: Renderer, private element: ElementRef) {
    this.nativeElement = element.nativeElement
    this.sidebarVisible = false
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle)
    const navbar: HTMLElement = this.element.nativeElement
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0]
  }

  getTitle() {
    const splitUrl = this.router.url.split('/')
    return splitUrl[2].replace(/^\w/, (chr) => chr.toUpperCase())
  }

  sidebarToggle() {
    const toggleButton = this.toggleButton
    const body = document.getElementsByTagName('body')[0]

    if (this.sidebarVisible === false) {
      setTimeout(function(){
        toggleButton.classList.add('toggled')
      }, 500)
      body.classList.add('nav-open')
      this.sidebarVisible = true
    } else {
      this.toggleButton.classList.remove('toggled')
      this.sidebarVisible = false
      body.classList.remove('nav-open')
    }
  }
}
