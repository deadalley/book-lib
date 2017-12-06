import { Component, OnInit, trigger,transition,style,animate,group,state,  } from '@angular/core';
import { Book } from '../../../book';
import { GoodreadsService } from '../../../services/goodreads.service';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
    moduleId: module.id,
    selector: 'library-home-cmp',
    templateUrl: 'library-home.component.html',
    styleUrls: [
      '../library.component.css',
      './library-home.component.css'
    ],
    animations: [
        trigger('cardbooks', [
            state('*', style({
                '-ms-transform': 'translate3D(0px, 0px, 0px)',
                '-webkit-transform': 'translate3D(0px, 0px, 0px)',
                '-moz-transform': 'translate3D(0px, 0px, 0px)',
                '-o-transform':'translate3D(0px, 0px, 0px)',
                transform:'translate3D(0px, 0px, 0px)',
                opacity: 1})),
                transition('void => *', [
                    style({opacity: 0,
                        '-ms-transform': 'translate3D(0px, 150px, 0px)',
                        '-webkit-transform': 'translate3D(0px, 150px, 0px)',
                        '-moz-transform': 'translate3D(0px, 150px, 0px)',
                        '-o-transform':'translate3D(0px, 150px, 0px)',
                        transform:'translate3D(0px, 150px, 0px)',
                    }),
                    animate('0.3s 0s ease-out')
                ])
        ]),
    ]
})

export class LibraryHomeComponent implements OnInit {
  btnOwned = false;
  btnRead = false;
  btnFavorite = false;

  owned = true;
  read = false
  favorite = false;

  tilesDisplay = true;

  book_1 : Book = {
    id: 1,
    isbn: 124,
    title: 'Harry Potter and the Philosopher\'s Stone',
    original: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    language: 'Portuguese',
    owned: true,
    read: true,
    favorite: false,
    goodreads: false,
    publisher: 'I don\'t know',
    year: 1999,
    pages: 455,
    genres: ['Fantasy', 'YA'],
    summary: 'Insert summary here.',
    collection: 'Harry Potter',
    tags: ['Books', 'JKR'],
    notes: 'Where are your notes?',
    image_large: '/assets/img/hp01.jpeg',
    image_small: '',
    rating: 4,
    gr_link: ''
  }

  book_2 : Book = {
    id: 2,
    isbn: 123,
    title: 'Harry Potter and the Chamber of Secrets',
    original: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    language: 'Portuguese',
    owned: true,
    read: false,
    goodreads: false,
    favorite: false,
    publisher: 'I don\'t know',
    year: 1999,
    pages: 455,
    genres: ['Fantasy', 'YA'],
    summary: 'Insert summary here2.',
    collection: 'Harry Potter',
    tags: ['Books', 'JKR'],
    notes: 'Where are your notes2?',
    image_large: '/assets/img/hp02.jpeg',
    image_small: '',
    rating: 4,
    gr_link: ''
  }

  books = [this.book_1, this.book_2];
  //books = this.fire.getBooks(this.books);

  constructor(
    private gr: GoodreadsService,
    private fire: FirebaseService
  ) { }

  ngOnInit() {
    this.tilesDisplay = true;
    console.log(this.book_1.hasOwnProperty('image_large'))
    //this.gr.getBooks(this.books)
  }
}
