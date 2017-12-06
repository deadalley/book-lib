import { TestBed, inject } from '@angular/core/testing';
import { Http } from '@angular/http';
import { AuthService } from './auth.service';

import { GoodreadsService } from './goodreads.service';

describe('GoodreadsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodreadsService, AuthService, Http]
    });
  });

  /*it('should be created', inject([GoodreadsService, Http], (service: GoodreadsService, http: Http) => {
    expect(service).toBeTruthy();
  }));*/

  it('should replace m with l in url', () => {
    let http: Http;
    this.service = new GoodreadsService(http, null);

    let url_m = 'https://images.gr-assets.com/books/1346448276l/6667916.jpg'
    let url_l = 'https://images.gr-assets.com/books/1346448276l/6667916.jpg'

    expect(this.service.imageToLarge(url_m)).toEqual(url_l);
  })
});
