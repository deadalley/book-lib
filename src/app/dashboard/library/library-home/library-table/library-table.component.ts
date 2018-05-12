import { Component, OnInit, Input, trigger, transition, style, animate, group, state } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Book } from '../../../../../interfaces/book'
import { formatDate } from '../../../../../utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'library-table',
  templateUrl: 'library-table.component.html',
  styleUrls: ['./library-table.component.css'],
  animations: [
    trigger('cardbooks', [
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
    ]),
  ]
})

export class LibraryTableComponent implements OnInit {
  @Input() books: Book[]
  formatDate = formatDate

  constructor() { }

  ngOnInit() { }
}
