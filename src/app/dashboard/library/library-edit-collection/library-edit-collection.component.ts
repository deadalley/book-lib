import { Component, OnInit, Output, ViewChild, EventEmitter, trigger, transition, style, animate, group, state } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Location } from '@angular/common'
import { Collection } from '../../../../interfaces/collection'
import { LibraryService } from '../library.service'
import { Router } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'library-edit-collection',
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

export class LibraryEditCollectionComponent implements OnInit {
  form: FormGroup
  collection: Collection
  title = 'Edit collection'
  description = 'Edit collection'
  button = 'Update collection'

  get collectionId(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 2]
  }

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private libraryService: LibraryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ''
    })
    this.libraryService.findCollection(this.collectionId).subscribe((collection) => {
      if (!collection) { return }
      this.collection = collection

      this.form.patchValue({
        title: this.collection.title,
        description: this.collection.description
      })
    })
  }

  ngOnInit() { }

  submit(formValues) {
    this.collection = {
      id: this.collection.id,
      title: formValues.title,
      description: formValues.description,
      books: this.collection.books
    }

    console.log('Updating collection', this.collection)
    this.libraryService.updateCollection(this.collection)
    this.location.back()
  }
}
