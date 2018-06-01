import { Component, OnInit, Input, Output, EventEmitter, trigger, transition, style, animate, group, state } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Book } from 'interfaces/book'
import { Author } from 'interfaces/author'
import { Router } from '@angular/router'
import { GoodreadsService } from 'services/goodreads.service'
import { objectToArray, parseBook } from 'utils/helpers'
import * as _ from 'lodash'

@Component({
  moduleId: module.id,
  selector: 'library-author',
  templateUrl: 'library-author.component.html',
  styleUrls: ['./library-author.component.css'],
  animations: [
    trigger('card', [
      state('*', style({
        '-ms-transform': 'translate3D(0px, 0px, 0px)',
        '-webkit-transform': 'translate3D(0px, 0px, 0px)',
        '-moz-transform': 'translate3D(0px, 0px, 0px)',
        '-o-transform': 'translate3D(0px, 0px, 0px)',
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
        transition('void => *', [
          style({opacity: 0,
            '-ms-transform': 'translate3D(0px, 150px, 0px)',
            '-webkit-transform': 'translate3D(0px, 150px, 0px)',
            '-moz-transform': 'translate3D(0px, 150px, 0px)',
            '-o-transform': 'translate3D(0px, 150px, 0px)',
            transform: 'translate3D(0px, 150px, 0px)',
          }),
          animate('0.3s 0s ease-out')
        ])
    ])
  ]
})

export class LibraryAuthorComponent implements OnInit {
  author = { } as Author
  isLoading = true

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1]
  }

  constructor(
    private location: Location,
    private goodreadsService: GoodreadsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.goodreadsService.getAuthor((author) => {
      if (author) {
        this.isLoading = false

        this.author = {
          id: author.id,
          name: author.name,
          about: author.about,
          books: <Book[]> author.books.book.map((book) =>
            <Book> _.omit(parseBook(book), ['author'])),
          image_small: author.small_image_url,
          image_large: author.large_image_url ? author.large_image_url : author.image_url,
          goodreadsLink: author.link
        }
      }
      console.log(this.author)
    }, this.localUrlPath)
  }
}
