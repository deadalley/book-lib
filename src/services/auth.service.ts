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

  private createUserInDatabase(user) {
    this.database.findUserById(user.uid, (_user) => {
      if (_user === null) {
        console.log('user does not exist.')

        this._activeUser = {
          name: user.displayName,
          id: user.uid,
          email: user.email,
          books: []
        }
        this.database.pushUser(this._activeUser)
      } else { this._activeUser = user }

      localStorage.setItem('user', JSON.stringify(this._activeUser))
    })
  }

  loginGoogle() {
    this.fireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider)
      .then((response) => {
        console.log('Successfully logged in')
        localStorage.setItem('userLoginCredentials', JSON.stringify(response.user))

        this.createUserInDatabase(response.user)

        this.router.navigate(['library'])
      })
      .catch((error) => {
        console.log('Could not login')
        console.log(error)
      })
  }

  loginEmail({ email, password}, onError) {
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log('Successfully logged in')
        localStorage.setItem('userLoginCredentials', JSON.stringify(response))

        this.database.findUserById(response.uid, (user) => {
          this._activeUser = user
          localStorage.setItem('user', JSON.stringify(this._activeUser))
        })

        this.router.navigate(['library'])
      })
      .catch((error) => {
        console.log('Could not login with e-mail and password')
        console.log(error.code, error.message)
        onError(error)
      })
  }

  signUpWithEmail({ email, password }) {
    this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((response) => {
        console.log('Successfully signed up in')
        localStorage.setItem('userLoginCredentials', JSON.stringify(response))

        this.createUserInDatabase(response)

        this.router.navigate(['library'])
      })
      .catch((error) => {
        console.log('Could not sign up with e-mail and password')
        console.log(error.code, error.message)
      })
  }
}
