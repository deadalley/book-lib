import { Component, OnInit, trigger,transition,style,animate,group,state } from '@angular/core';
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Book } from '../../book';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css', '../library/library.component.css'],
  animations: [
      trigger('card', [
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
      ])
  ]
})
export class DashboardHomeComponent implements OnInit {

  form: FormGroup;
  book = {} as Book;

  languages = ['English', 'Portuguese', 'German'];
  collections = [];
  genres = [];

  selectedLanguage = 'Select a language';
  selectedCollection = "Add book to a collection";
  firstLogin = true;

  latestBooks = []

  constructor(
    private fb: FormBuilder,
    private fire: FirebaseService
  ) { }

  ngOnInit() {
    // Check if library is empty
    this.fire.hasBooks((val) => {this.firstLogin = !val})

    // Form and book for first login card
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      language: '',
      owned: true,
      read: false,
      favorite: false,
      original: '',
      publisher: '',
      year: 0,
      pages: 0,
      rating: 0
    });

    this.book.language = 'Select a language'
    this.book.owned = true
    this.book.read = false
    this.book.favorite = false
    //this.book.date = new Date().toISOString().slice(0, 10);

    /*var myDate = new Date();
    var dayOfMonth = myDate.getDate();
    myDate.setDate(dayOfMonth - 3);

    console.log(myDate.toISOString().slice(0, 10))*/

    this.fire.getLatestBooks(this.latestBooks);
  }

  addBook(info) {
    this.book.title = info.title;
    this.book.author = info.author;
    this.book.genres = this.genres;

    if (this.selectedLanguage != 'Select a language')
      this.book.language = this.selectedLanguage;

    if (info.original != '')
      this.book.original = info.original;

    if (info.year != 0)
      this.book.year = info.year;

    if (info.pages != 0)
      this.book.pages = info.pages;

    if (info.rating != 0)
      this.book.rating = info.rating;

    this.fire.addBook(this.book)
  }
}
