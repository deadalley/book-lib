import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { SessionService } from './session.service'
import { DatabaseService } from './database.service'
import { mergeMap, filter } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Injectable()
export class UiService {
  private _bookGrouping = new BehaviorSubject<string>('no grouping')
  private _collectionGrouping = new BehaviorSubject<string>('no grouping')

  bookGrouping$ = this._bookGrouping.asObservable()
  collectionGrouping$ = this._collectionGrouping.asObservable()
  bookCount$: Observable<number>

  constructor(
    private databaseService: DatabaseService,
    private sessionService: SessionService
  ) {
    this.bookCount$ = this.sessionService.userRef.pipe(
      filter(userRef => !!userRef),
      mergeMap(userRef => this.databaseService.subscribeToBookCount(userRef))
    )
  }

  set bookGrouping(value) {
    this._bookGrouping.next(value)
  }
  set collectionGrouping(value) {
    this._collectionGrouping.next(value)
  }
}
