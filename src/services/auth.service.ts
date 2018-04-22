import { Injectable } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database'
import { Router } from '@angular/router'
import * as firebase from 'firebase/app'
import { DatabaseService } from './database.service'
import { User } from '../interfaces/user'

@Injectable()
export class AuthService {
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

        _user = {
          name: user.displayName,
          id: user.uid,
          email: user.email,
          books: []
        }
        this.database.pushUser(_user)
      }

      const _ref = Object.keys(_user)[0]
      _user = {
        ...(_user[_ref]),
        ref: _ref
      }

      localStorage.setItem('user', JSON.stringify(_user))
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

        this.database.findUserById(response.uid, (_user) => {
          const _ref = Object.keys(_user)[0]
          _user = {
            ...(_user[_ref]),
            ref: _ref
          }
          localStorage.setItem('user', JSON.stringify(_user))
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
