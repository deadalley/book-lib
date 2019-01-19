import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class UiService {
  private _bookOrdering = new BehaviorSubject<string>('no grouping')
  private _collectionOrdering = new BehaviorSubject<string>('no grouping')
  private _tilesDisplay = new BehaviorSubject<boolean>(true)
  private _tagsDisplay = new BehaviorSubject<boolean>(false)

  bookOrdering$ = this._bookOrdering.asObservable()
  collectionOrdering$ = this._collectionOrdering.asObservable()
  tilesDisplay$ = this._tilesDisplay.asObservable()
  tagsDisplay$ = this._tagsDisplay.asObservable()

  set bookOrdering(value) {
    this._bookOrdering.next(value)
  }
  set collectionOrdering(value) {
    this._collectionOrdering.next(value)
  }
  set tilesDisplay(value) {
    this._tilesDisplay.next(value)
  }
  set tagsDisplay(value) {
    this._tagsDisplay.next(value)
  }
}
