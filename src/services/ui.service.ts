import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class UiService {
  private _bookGrouping = new BehaviorSubject<string>('no grouping')
  private _collectionGrouping = new BehaviorSubject<string>('no grouping')

  bookGrouping$ = this._bookGrouping.asObservable()
  collectionGrouping$ = this._collectionGrouping.asObservable()

  set bookGrouping(value) {
    this._bookGrouping.next(value)
  }
  set collectionGrouping(value) {
    this._collectionGrouping.next(value)
  }
}
