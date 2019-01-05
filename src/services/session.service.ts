import { Injectable } from '@angular/core'
import { User } from 'interfaces/user'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { LibraryService } from './library.service'

@Injectable()
export class SessionService {
  private _userRef = new BehaviorSubject<string>(undefined)
  private _goodreadsId = new BehaviorSubject<string>(undefined)

  userRef = this._userRef.asObservable()
  goodreadsId = this._goodreadsId.asObservable()

  get localUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  set localUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  get userId() {
    return JSON.parse(localStorage.getItem('user')).id
  }

  constructor(private library: LibraryService) {}

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

    this._userRef.next(user.ref)
    this.library.setUserRef = user.ref
    this.library.loadBooks()
    this.library.loadCollections()
  }

  destroySession() {
    localStorage.removeItem('user')
    this._userRef.next(null)
    this.library.setUserRef = null
  }
}
