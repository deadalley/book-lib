import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { HttpGet, HttpGetAll } from 'utils/http'
import { environment } from 'environments/environment'
import { SessionService } from './session.service'
import * as _ from 'lodash'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { map, mergeMap } from 'rxjs/operators'

const USE_PROXY = true

@Injectable()
export class GoodreadsService {
  private key = environment.goodreadsConfig.key
  private domain = USE_PROXY
    ? environment.goodreadsConfig.proxyDomain
    : environment.goodreadsConfig.domain

  private id = new BehaviorSubject<string>(undefined)

  goodreadsId = this.id.asObservable()
  defaultParams = new HttpParams().set('key', this.key)

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
    if (this.sessionService.localUser) {
      this.id.next(this.sessionService.localUser.goodreadsId)
    }
  }

  private parseUrl(url: string) {
    return `${url}.xml`
  }

  getUser(cb, id?: number) {
    const userId = id ? id : this.id
    const url = `${this.domain}/user/show/${userId}`

    // HttpGet(this.http, this.parseUrl(url), this.defaultParams, cb)
  }

  getBook(id: number) {
    // key: Developer key (required).
    // id: A Goodreads internal book_id
    // text_only: Only show reviews that have text (default false)
    // rating: Show only reviews with a particular rating (optional)
    const url = `${this.domain}/book/show/${id}`

    return HttpGet(this.http, this.parseUrl(url), this.defaultParams).pipe(
      map<any, any>(response => response.book)
    )
  }

  getAuthor(cb, id: number) {
    const url = `${this.domain}/author/show/${id}`

    // HttpGet(this.http, this.parseUrl(url), this.defaultParams, response =>
    //   cb(response.author)
    // )
  }

  getBooks(ids: number[]) {
    const requests = ids.map(id => ({
      url: this.parseUrl(`${this.domain}/book/show/${id}`),
      params: this.defaultParams,
    }))
    return HttpGetAll(this.http, requests).pipe(
      map(responses => responses.map(response => response.book))
    )
  }

  getBooksForUser(cb, id?: number) {
    const userId = id ? id : this.id.getValue()

    if (!userId) {
      return
    }
    const params = this.defaultParams
      .set('v', '2')
      .set('id', userId as string)
      .set('shelf', 'all')
      .set('sort', 'title')
      .set('format', 'xml')
    const url = `${this.domain}/review/list`

    // HttpGet(this.http, url, params, rawBooks =>
    //   cb(
    //     rawBooks ? rawBooks.reviews.review.map(review => review.book) : rawBooks
    //   )
    // )
  }

  searchBook(query: string) {
    // q: The query text to match against book title, author, and ISBN fields. Supports boolean operators and phrase searching.
    // page: Which page to return (default 1, optional)
    // key: Developer key (required).
    // search[field]: Field to search, one of 'title', 'author', or 'all' (default is 'all')
    const url = `${this.domain}/search/index`
    const params = this.defaultParams.set('q', decodeURI(query))

    return HttpGet(this.http, this.parseUrl(url), params).pipe(
      map<any, any>(response => {
        const work = response.search.results.work
        const results = Array.isArray(work) ? work : [work]
        return _.uniq(results.map(item => item.best_book))
      })
    )
  }

  searchAuthor(name: string) {
    const url = `${this.domain}/search/index`
    const params = this.defaultParams
      .set('q', decodeURI(name))
      .set('search[field]', 'author')

    return HttpGet(this.http, this.parseUrl(url), params).pipe(
      map<any, any>(response =>
        _.uniq(
          response.search.results.work.map(item => item.best_book.author.id._)
        )
      ),
      mergeMap<any, any>(authorIds =>
        HttpGetAll(
          this.http,
          authorIds.map(id => ({
            url: `${this.domain}/author/show/${id}`,
            params: this.defaultParams,
          }))
        )
      ),
      map<any, any>(results => results.map(result => result.author))
    )

    response => {
      const authorIds = _.uniq(
        response.search.results.work.map(item => item.best_book.author.id._)
      )

      HttpGetAll(
        this.http,
        authorIds.map(id => ({
          url: `${this.domain}/author/show/${id}`,
          params: this.defaultParams,
        })),
        results => cb(results.map(result => result.author))
      )
    }
  }
}
