import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class UiService {
  private _bookGrouping = new BehaviorSubject<string>('no grouping')
  private _collectionGrouping = new BehaviorSubject<string>('no grouping')
  private _tilesDisplay = new BehaviorSubject<boolean>(true)
  private _tagsDisplay = new BehaviorSubject<boolean>(false)

  bookGrouping$ = this._bookGrouping.asObservable()
  collectionGrouping$ = this._collectionGrouping.asObservable()
  tilesDisplay$ = this._tilesDisplay.asObservable()
  tagsDisplay$ = this._tagsDisplay.asObservable()

  set bookGrouping(value) {
    this._bookGrouping.next(value)
  }
  set collectionGrouping(value) {
    this._collectionGrouping.next(value)
  }
  set tilesDisplay(value) {
    this._tilesDisplay.next(value)
  }
  set tagsDisplay(value) {
    this._tagsDisplay.next(value)
  }
}
