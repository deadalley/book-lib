import { Component, OnInit, Input, Output, EventEmitter, trigger, transition, style, animate, group, state } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms'
import { Book } from '../../../../interfaces/book'
import BookFactory from '../../../../factories/book'

@Component({
  moduleId: module.id,
  selector: 'library-book',
  templateUrl: 'library-book.component.html',
  styleUrls: ['./library-book.component.css'],
  animations: [
    trigger('cardbook', [
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

export class LibraryBookComponent implements OnInit {
  book = {} as Book

  ngOnInit() {
    this.book = BookFactory.build()
    console.log(this.book)
  }
}
