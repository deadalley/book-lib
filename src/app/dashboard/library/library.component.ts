import { Component, OnInit, trigger, transition, style, animate, group, state } from '@angular/core'
import 'rxjs/add/operator/map'
import { LibraryService } from './library.service'
import CollectionFactory from '../../../factories/collection'

@Component({
  moduleId: module.id,
  selector: 'library-cmp',
  templateUrl: 'library.component.html',
  styleUrls: [],
  animations: [
    trigger('cardicons', [
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

export class LibraryComponent implements OnInit {
  constructor(private libraryService: LibraryService) { }

  ngOnInit() { }
}
