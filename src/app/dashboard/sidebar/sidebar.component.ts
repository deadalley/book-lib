import { Component, OnInit } from '@angular/core'
import { AuthService } from 'services/auth.service';

declare var $: any

export interface RouteInfo {
  path: string
  title: string
  icon: string
  class: string
}

export const ROUTES: RouteInfo[] = [
  { path: 'home', title: 'Home',  icon: 'pe-7s-home', class: '' },
  { path: 'library', title: 'Library',  icon: 'pe-7s-notebook', class: '' },
  { path: 'profile', title: 'Profile',  icon: 'pe-7s-user', class: '' },
]

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
  public menuItems: any[]

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem)
  }

  isNotMobileMenu() {
    if ($(window).width() > 991) {
      return false
    }
    return true
  }

  signOut() {
    this.authService.logout()
  }
}
