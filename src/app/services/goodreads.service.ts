import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';
import { parseString, parseNumbers } from 'xml2js';
import { Book } from '../book';
import xml2js from 'xml2js';

import 'rxjs/add/operator/map';
import 'rxjs/operator/mergeMap';

@Injectable()
export class GoodreadsService {
  key = 'Lxpz447iVHg9nhHt2OCgQ';
  secret = 'Ke2MlJv4ipWVRYARzef5JxYwtZSKWfktRMQZ4i4jSE';
  results: any;
  books: any;

  get user_id() {
    let user = localStorage.getItem('user_gr')
    user = JSON.parse(user).user_id;
    return user.split('|')[2]
  }

  get access_token() {
    return localStorage.getItem('gr_access_token');
  }

  constructor(private http: Http, private auth: AuthService) { }

  getBooks(books) {
    let sb = sessionStorage.getItem('books');

    if (sb) {
      let parse = JSON.parse(sb);
      for (let k in parse) {
        books.push(parse[k])
      }
      console.log(books)
      return;
    }

    let url = 'https://www.goodreads.com/review/list?v=2'
            + '&key=' + this.key
            + '&id=' + this.user_id
            + '&shelf=all'
            + '&sort=author'
            + '&format=xml'

    let callback = (json) => {
      console.log(json)
      for (let k in json['reviews']['review']) {
        let rev = json['reviews']['review'][k]
        console.log(rev)
        let book: Book = {
          id: +rev.book.id._,
          isbn: +rev.book.isbn,
          title: rev.book.title_without_series,
          author: rev.book.authors.author.name,
          original: '',
          language: '(not informed)',
          owned: false,
          read: false,
          favorite: false,
          goodreads: true,
          publisher: rev.book.publisher,
          year: rev.book.publication_year,
          pages: rev.book.num_pages,
          genres: [],
          summary: rev.book.description,
          collection: '',
          tags: [],
          notes: '',
          image_small: rev.book.image_url,
          image_large: this.imageToLarge(rev.book.image_url),
          rating: rev.book.average_rating,
          //date: '',
          gr_link: rev.book.link
        }
        books.push(book)
      }
      sessionStorage.setItem('books', JSON.stringify(books))
    }

    this.HttpGet(url, callback)
  }

  getBook(id) {
    let url = 'https://www.goodreads.com/book/show/'
            + id + '.xml?'
            + 'key=' + this.key

    let callback = (json) => {
      console.log(json)
    }
    this.HttpGet(url, callback)
  }

  searchBook(search) {
    let url = 'https://www.goodreads.com/search.xml?key=' + this.key + '&q=' + search;

    this.http.get(url).map((res:Response) => res.text()).subscribe(data => {
      let xml = data;
      //console.log(xml);
      parseString(xml, (err, res) => {
        //console.log(res);
        this.results = res.GoodreadsResponse.search[0].results[0].work;
      })
    });
    return this.results;
  }

  imageToLarge(url) {
    let split_url = url.split('/')
    let new_url = ''

    for (let k = 0; k < split_url.length; k++) {
      if (k == 4)
        new_url += split_url[k].replace('m', 'l')

      else new_url += split_url[k]

      if (k < split_url.length - 1)
        new_url += '/'
    }

    return new_url
  }

  private HttpGet(url, callback){
    let local;

    this.http.get(url)
      .map((res:Response) => res.text())
      .subscribe(xml => {

        new Promise(resolve => {

          let options = { explicitRoot: false, explicitArray: false };

          console.log(xml)
          parseString(xml, options, (err, res) => resolve(res))

        }).then(json => callback(json))
      })
  }
}
