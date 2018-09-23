import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { LibraryService } from './library.service'
import { User } from 'interfaces/user'

@Injectable()
export class SessionService {
  private _userRef = new BehaviorSubject<string>(undefined)
  private _goodreadsId = new BehaviorSubject<string>(undefined)

  userRef = this._userRef.asObservable()
  goodreadsId = this._goodreadsId.asObservable()

  get userId() {
    return JSON.parse(localStorage.getItem('user')).id
  }

  set setGoodreadsId(id: string) {
    const localUser = JSON.parse(localStorage.getItem('user'))
    localStorage.setItem('user', JSON.stringify({ ...(localUser), goodreadsId: id }))

    this._goodreadsId.next(id)
  }

  constructor(private library: LibraryService) { }

  buildSession(user: User = null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      user = JSON.parse(localStorage.getItem('user'))
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
