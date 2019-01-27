import { Component, OnInit } from '@angular/core'
import { AuthService } from 'services/auth.service'

declare var $: any

export interface RouteInfo {
  path: string
  title: string
  icon: string
  class: string
}

export const ROUTES: RouteInfo[] = [
  { path: 'home', title: 'Home', icon: 'pe-7s-home', class: '' },
  { path: 'books', title: 'Books', icon: 'pe-7s-notebook', class: '' },
  {
    path: 'collections',
    title: 'Collections',
    icon: 'pe-7s-albums',
    class: '',
  },
  { path: 'authors', title: 'Authors', icon: 'pe-7s-pen', class: '' },
  { path: 'goodreads', title: 'Goodreads', icon: 'pe-7s-science', class: '' },
  {
    path: 'import',
    title: 'Import library',
    icon: 'pe-7s-cloud-upload',
    class: '',
  },
  { path: 'profile', title: 'Profile', icon: 'pe-7s-user', class: '' },
]

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[]

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem)
  }

  isNotMobileMenu() {
    if ($(window).width() > 991) {
      return false
    }
    return true
  }
}
