import { Component, OnInit, Output, ViewChild, EventEmitter, trigger, transition, style, animate, group, state } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Collection } from '../../../../interfaces/collection'

@Component({
  moduleId: module.id,
  selector: 'library-add-collection',
  templateUrl: 'library-add-collection.component.html',
  styleUrls: ['./library-add-collection.component.css'],
  animations: [
    trigger('cardaddbook', [
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

export class LibraryAddCollectionComponent implements OnInit {
  form: FormGroup
  collection: Collection

  constructor(private fb: FormBuilder, private location: Location) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ''
    })
  }

  ngOnInit() { }

  addCollection(formValues) {
    this.collection = {
      title: formValues.title,
      description: formValues.description,
      books: []
    }

    console.log('Adding collection', this.collection)
  }
}
