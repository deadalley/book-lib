import { Injectable } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database'
import { Router } from '@angular/router'
import * as firebase from 'firebase/app'
import { DatabaseService } from './database.service'
import { User } from '../interfaces/user'

@Injectable()
export class AuthService {
  private _activeUser: User

  get activeUser(): User { return this._activeUser }

  constructor (
    public fireAuth: AngularFireAuth,
    private fireDb: AngularFireDatabase,
    private router: Router,
    private database: DatabaseService
  ) { }

  loginGoogle() {
    this.fireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider)
      .then((response) => {
        console.log('Successfully logged in')
        localStorage.setItem('userGoogle', JSON.stringify(response.user))

        this.database.findUserById(response.user.uid, (user) => {
          if (user === null) {
            console.log('user does not exist.')

            this._activeUser = {
              name: response.user.displayName,
              id: response.user.uid,
              books: []
            }
            this.database.pushUser(this._activeUser)
          } else { this._activeUser = user }

          localStorage.setItem('user', JSON.stringify(this._activeUser))
        })

        this.router.navigate(['library'])
      })
      .catch((error) => {
        console.log('Could not login')
        console.log(error)
      })
  }
}
