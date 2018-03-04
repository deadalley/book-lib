import { Component, OnInit, Input, trigger, transition, style, animate, group, state } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Book } from '../../../../interfaces/book'

@Component({
  moduleId: module.id,
  selector: 'library-section',
  templateUrl: 'library-section.component.html',
  styleUrls: [],
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

export class LibrarySectionComponent implements OnInit {
  sectionTitle: string
  @Input() books: Book[]

  ngOnInit() {
    this.sectionTitle = this.books[0].author
  }
}
