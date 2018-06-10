import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { HttpGet, HttpGetAll } from 'utils/http'
import { environment } from 'environments/environment'
import { AuthService } from './auth.service'
import * as _ from 'lodash'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

const USE_PROXY = true

@Injectable()
export class GoodreadsService {
  private key = environment.goodreadsConfig.key
  private secret = environment.goodreadsConfig.secret
  private domain = USE_PROXY ? environment.goodreadsConfig.proxyDomain : environment.goodreadsConfig.domain

  private id = new BehaviorSubject<string>(undefined)

  goodreadsId = this.id.asObservable()
  defaultParams = new HttpParams().set('key', this.key)

  constructor(private http: HttpClient, private auth: AuthService) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      this.id.next(JSON.parse(localStorage.getItem('user')).goodreadsId)
    }

    this.auth.goodreadsId.subscribe((goodreadsId) => {
      if (!goodreadsId || goodreadsId === this.id.getValue()) { return }
      this.id.next(goodreadsId)
    })
  }

  private parseUrl(url: string) {
    return `${url}.xml`
  }

  getUser(cb, id?: number) {
    const userId = id ? id : this.id
    const url = `${this.domain}/user/show/${userId}`

    HttpGet(this.http, this.parseUrl(url), this.defaultParams, cb)
  }

  getBook(cb, id: number) {
    const url = `${this.domain}/book/show/${id}`

    HttpGet(this.http, this.parseUrl(url), this.defaultParams, (response) => cb(response.book))
  }

  getAuthor(cb, id: number) {
    const url = `${this.domain}/author/show/${id}`

    HttpGet(this.http, this.parseUrl(url), this.defaultParams, (response) => cb(response.author))
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

    HttpGet(
      this.http,
      url,
      params,
      (rawBooks) => cb(rawBooks ? rawBooks.reviews.review.map((review) => review.book) : rawBooks))
  }

  searchBook(cb, name: string) {
    const url = `${this.domain}/search/index`
    const params = this.defaultParams
      .set('q', decodeURI(name))
      .set('search[field]', 'title')

    HttpGet(this.http, this.parseUrl(url), params, (response) => {
      const work = response.search.results.work
      const results = Array.isArray(work) ? work : [work]
      const books = _.uniq(results.map((item) => item.best_book))

      cb(books)
    })
  }

  searchAuthor(cb, name: string) {
    const url = `${this.domain}/search/index`
    const params = this.defaultParams
      .set('q', decodeURI(name))
      .set('search[field]', 'author')

    HttpGet(this.http, this.parseUrl(url), params, (response) => {
      const authorIds = _.uniq(response.search.results.work.map((item) => item.best_book.author.id._))

      HttpGetAll(
        this.http,
        authorIds.map((id) => ({
          url: `${this.domain}/author/show/${id}`,
          params: this.defaultParams
        })),
      (results) => cb(results.map((result) => result.author)))
    })
  }
 }
