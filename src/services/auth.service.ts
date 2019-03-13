import { Injectable } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import * as firebase from 'firebase/app'
import * as auth0 from 'auth0-js'
import { DatabaseService } from './database.service'
import { SessionService } from './session.service'
import { User as LocalUser } from '../models/user.model'
import { User as DBUser } from '../database/models/user.model'
import { environment } from 'environments/environment'

@Injectable()
export class AuthService {
  private readonly localDomain = environment.localDomain
  private readonly clientID = environment.auth0Config.clientId
  private readonly domain = environment.auth0Config.domain
  private readonly redirectURI = environment.auth0Config.redirectUri
  private readonly defaultParams = {
    clientID: this.clientID,
    domain: this.domain,
    responseType: 'token id_token',
    audience: `https://${this.domain}/userinfo`,
    redirectUri: this.redirectURI,
    scope: 'openid',
  }

  private auth0 = new auth0.WebAuth(this.defaultParams)

  private _userRef = new BehaviorSubject<string>(undefined)
  private _goodreadsId = new BehaviorSubject<string>(undefined)

  userRef = this._userRef.asObservable()
  goodreadsId = this._goodreadsId.asObservable()

  constructor(
    public fireAuth: AngularFireAuth,
    private router: Router,
    private database: DatabaseService,
    private session: SessionService
  ) {
    const user = this.session.localUser
    if (user) {
      this._userRef.next(user.id)
      this._goodreadsId.next(user.goodreadsId)
    }
    this.setupSessionForGoodreadsLogin()
  }

  private setupSessionForGoodreadsLogin() {
    this.auth0.parseHash((error, result) => {
      if (result && result.accessToken && result.idToken) {
        window.location.hash = ''

        this.auth0.client.userInfo(result.accessToken, (err, user) => {
          const goodreadsId = user.sub.split('|')[2]
          this.session.goodreadsId = goodreadsId

          this.database.updateUser(this.session.userId, {
            goodreadsId,
          })
        })
      } else if (error) {
        console.log('Could not log in on Goodreads')
        console.log(error)
      }
    })
  }

  private createUserInDatabase(user, params: object = {}) {
    return this.database
      .findUserByParam('uid', user.uid)
      .then(async userInDatabase => {
        if (userInDatabase === null) {
          console.log('User not found in database')
          console.log('Creating user in database')

          const newUser = {
            uid: user.uid,
            name: user.displayName || params['displayName'],
            email: user.email,
            displayWelcomeMessage: true,
            avatarUrl: user.photoUrl,
          } as DBUser

          return this.database.createUser(newUser)
        } else {
          return userInDatabase as LocalUser
        }
      })
  }

  private processResponse(user: object, params: object = {}) {
    return this.createUserInDatabase(user, params).then(userInDatabase => {
      localStorage.setItem('userLoginCredentials', JSON.stringify(user))
      this.database.isLoggedIn.next(true)
      this.session.buildSession(userInDatabase)
      this.router.navigate(['library'])
    })
  }

  loginGoodreads(redirectPath?: string) {
    const redirectUri = redirectPath
      ? `${this.localDomain}/${redirectPath}`
      : this.redirectURI

    this.auth0 = new auth0.WebAuth({ ...this.defaultParams, redirectUri })

    this.auth0.authorize({ connection: 'goodreads' })
  }

  loginGoogle() {
    this.fireAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(response => {
        this.processResponse(response.user)
      })
      .catch(error => {
        console.log('Could not login with Google')
        console.log(error)
      })
  }

  loginFacebook() {
    this.fireAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(response => {
        this.processResponse(response.user)
      })
      .catch(error => {
        console.log('Could not login with Facebook')
        console.log(error)
      })
  }

  loginEmail({ email, password, name }, onError = (...args) => {}) {
    return this.fireAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(response =>
        this.processResponse(response.user, { displayName: name })
      )
      .catch(error => {
        console.log('Could not login with e-mail and password')
        console.log(error.code, error.message)
        onError(error)
      })
  }

  signUpWithEmail({ email, password, name }) {
    this.fireAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        this.processResponse(response.user, { displayName: name })
      })
      .catch(error => {
        console.log('Could not sign up with e-mail and password')
        console.log(error.code, error.message)
      })
  }

  logout() {
    this.fireAuth.auth
      .signOut()
      .then(() => {
        console.log('Sucessefully signed out')

        localStorage.removeItem('userLoginCredentials')
        this.database.isLoggedIn.next(false)
        this.session.destroySession()
        this.router.navigate(['home'])
      })
      .catch(error => {
        console.log('Could not sign out')
        console.log(error.code, error.message)
      })
  }
}
