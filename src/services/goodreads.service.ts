import { Injectable } from '@angular/core'
import { Headers, Http, Response, RequestOptions } from '@angular/http'
import { HttpGet } from '../utils/http'
import { environment } from 'environments/environment'
import { AuthService } from './auth.service'

@Injectable()
export class GoodreadsService {
  private key = environment.goodreadsConfig.key
  private secret = environment.goodreadsConfig.secret
  private domain = environment.goodreadsConfig.domain

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

  getUser(id: number, cb) {
    const url = `${this.domain}/user/show/${id}`

    HttpGet(this.http, this.parseUrl(url), cb)
  }

  getBook(id: number, cb) {
    const url = `${this.domain}/book/show/${id}`

    HttpGet(this.http, this.parseUrl(url), cb)
  }
}
