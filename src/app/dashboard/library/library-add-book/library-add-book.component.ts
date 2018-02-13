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
  
}
