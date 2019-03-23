import { Injectable } from '@angular/core'
import { User } from 'models/user.model'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class SessionService {
  private _localUser = new BehaviorSubject<User>(undefined)
  private _userId = new BehaviorSubject<string>(undefined)
  private _goodreadsId = new BehaviorSubject<number>(undefined)

  localUser$ = this._localUser.asObservable()
  userId$ = this._userId.asObservable()
  goodreadsId$ = this._goodreadsId.asObservable()

  get localUser(): User {
    return JSON.parse(localStorage.getItem('user'))
  }

  set localUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
    this._localUser.next(user)
  }

  get userId() {
    return JSON.parse(localStorage.getItem('user')).id
  }

  set goodreadsId(id: number) {
    this._goodreadsId.next(id)
  }

  buildSession(user: User = null) {
    if (user) {
      this.localUser = user
    } else {
      user = this.localUser
    }

    console.log('Building session...')
    this._goodreadsId.next(+user.goodreadsId)
    this._localUser.next(user)
    this._userId.next(user.id)
  }

  destroySession() {
    console.log('Destroying session...')
    localStorage.removeItem('user')
    this._localUser.next(undefined)
    this._userId.next(undefined)
  }
}
