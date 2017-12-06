import { Component, Output, EventEmitter, trigger,transition,style,animate,group,state } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl , FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Book } from '../../../book';

@Component({
    moduleId: module.id,
    selector: 'library-add-book-cmp',
    templateUrl: 'library-add-book.component.html',
    styleUrls: [
      '../library.component.css',
      './library-add-book.component.css'
    ],
    animations: [
        trigger('cardaddbook', [
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

export class LibraryAddBookComponent{
  @Output() onAddBook = new EventEmitter<Book>();

  form: FormGroup;

  book : Book;

  summary = "Never Go Back is the eighteenth book in the Jack Reacher series written\
   by Lee Child. It was published on 3 September 2013 in the United States. The book\
   continues the storyline covered in the novels 61 Hours, Worth Dying For and A Wanted Man.";

  collections = [
    'The Reacher Books',
    'The Passage',
    'The Girl with the Dragon Tattoo'
  ]

  genres = [
    'Fiction',
    'Thriller',
    'Mystery'
  ]

  tags = [
    'Lee Child',
    'Favorites',
    'Read',
    'Owned',
    'Jack Reacher',
    'Collection'
  ]

  languages = ['English', 'Portuguese', 'German'];

  selectedLanguage = "Select a language";
  selectedCollection = "Add book to a collection";

  constructor(public fb: FormBuilder, private location: Location) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      original: '',
      author: ['', Validators.required],
      authorWatch: false,
      publisher: '',
      year: 0,
      pages: 0,
      notes: '',
      rating: 0
    });

    /*this.book = {
      id: 0,
      title: '',
      author: '',
      language: '',
      owned: true,
      read: false,
      favorite: false,
      publisher: '',
      year: 0,
      pages: 0,
      genres: [],
      summary: '',
      collection: '',
      tags: [],
      notes: '',
      image: '',
      rating: 0
    }*/
  }

  onChange() {

  }

  addBook(info) {
    /*this.book = {
      id: 0,
      title: info.title,
      author: info.author,
      language: this.selectedLanguage.localeCompare('Select a language') == 0 ? '' : this.selectedLanguage,
      owned: info.owned,
      read: info.read,
      favorite: info.favorite,
      publisher: info.publisher,
      year: info.year,
      pages: info.pages,
      genres: this.genres,
      summary: this.summary,
      collection: this.selectedCollection.localeCompare('Add book to a collection') == 0 ? '' : this.selectedCollection,
      tags: this.tags,
      notes: info.notes,
      image_large: '',
      rating: info.rating
    }*/

    this.onAddBook.emit(this.book);
    console.log(info);
  }
}
