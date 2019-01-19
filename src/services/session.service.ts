import { Injectable } from '@angular/core'
import { User } from 'models/user.model'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class SessionService {
  private _userRef = new BehaviorSubject<string>(undefined)
  private _goodreadsId = new BehaviorSubject<string>(undefined)

  userRef = this._userRef.asObservable()
  goodreadsId = this._goodreadsId.asObservable()

  get localUser(): User {
    return JSON.parse(localStorage.getItem('user'))
  }

  set localUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  get userId() {
    return JSON.parse(localStorage.getItem('user')).id
  }

  setGoodreadsId(id: string) {
    this.localUser = { ...this.localUser, goodreadsId: id }

    this._goodreadsId.next(id)
  }

  buildSession(user: User = null) {
    if (user) {
      this.localUser = user
    } else {
      user = this.localUser
    }

    console.log('Building session...')
    this._userRef.next(user.id)
  }

  destroySession() {
    console.log('Destroying session...')
    localStorage.removeItem('user')
    this._userRef.next(null)
  }
}
