import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('userLoginCredentials')
    if (!isAuthenticated) {
      this.router.navigate(['home'])
    }
    return isAuthenticated
  }
}
