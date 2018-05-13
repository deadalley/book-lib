import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('userLoginCredentials')
    if (!isAuthenticated) {
      this.router.navigate(['home'])
    }
    return isAuthenticated
  }
}
