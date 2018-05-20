import { Injectable } from '@angular/core'
import { Headers, Http, Response, RequestOptions } from '@angular/http'
import { HttpGet } from '../utils/http'
import { environment } from 'environments/environment'
import { AuthService } from './auth.service'

const USE_PROXY = true

@Injectable()
export class GoodreadsService {
  private key = environment.goodreadsConfig.key
  private secret = environment.goodreadsConfig.secret
  private domain = USE_PROXY ? environment.goodreadsConfig.proxyDomain : environment.goodreadsConfig.domain

  id: string
  constructor(private http: Http, private auth: AuthService) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      this.id = JSON.parse(localStorage.getItem('user')).goodreadsId
    }

    this.auth.goodreadsId.subscribe((goodreadsId) => {
      if (!goodreadsId || goodreadsId === this.id) { return }
      this.id = goodreadsId
    })
  }

  private parseUrl(url: string) {
    return `${url}.xml?key=${this.key}`
  }

  getUser(cb, id?: number) {
    const userId = id ? id : this.id
    const url = `${this.domain}/user/show/${userId}`

    HttpGet(this.http, this.parseUrl(url), cb)
  }

  getBook(cb, id: number) {
    const url = `${this.domain}/book/show/${id}`

    HttpGet(this.http, this.parseUrl(url), cb)
  }

  getBooksForuser(cb, id?: number) {
    const userId = id ? id : this.id
    const url = `${this.domain}/review/list?v=2&key=${this.key}&id=${userId}&shelf=all&sort=title&format=xml`

    HttpGet(this.http, url, (rawBooks) => cb(rawBooks ? rawBooks.reviews.review.map((review) => review.book) : rawBooks))
  }
}
