import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private fire: FirebaseService, private _route: ActivatedRoute) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log(route.url[0].path)

    // Guard dashboard routing
    if (route.url[0].path == 'dashboard') {

      // Check if user is logged in
      if (localStorage.getItem('user_google')) {
        return true
      }

      else {
        this.router.navigate(['home']);
        return false;
      }

      //if (localStorage.getItem('gr_access_token'))
        //return true;
    }
    else return false;

    //if(window.location.hash)
      //return true;

  }
}
