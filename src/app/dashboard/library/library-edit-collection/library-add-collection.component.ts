import { Component, OnInit, Output, ViewChild, EventEmitter, trigger, transition, style, animate, group, state } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Collection } from '../../../../interfaces/collection'
import { LibraryService } from '../library.service'

@Component({
  moduleId: module.id,
  selector: 'library-add-collection',
  templateUrl: 'library-edit-collection.component.html',
  styleUrls: ['./library-edit-collection.component.css'],
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
  title = 'Add new collection'
  description = 'Add a new collection to your library'
  button = 'Add collection'

  constructor(private fb: FormBuilder, private location: Location, private libraryService: LibraryService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ''
    })
  }

  ngOnInit() { }

  submit(formValues) {
    this.collection = {
      id: '',
      title: formValues.title,
      description: formValues.description,
      books: []
    }

    console.log('Adding collection', this.collection)
    this.libraryService.addCollection(this.collection)
    this.location.back()
  }
}
