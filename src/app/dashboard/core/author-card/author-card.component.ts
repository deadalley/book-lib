import { Component, OnInit, Input, trigger, transition, style, animate, group, state, Output, EventEmitter } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Author } from 'interfaces/author'
import { formatDate } from 'utils/helpers'

@Component({
  selector: 'author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.css'],
  animations: [
    trigger('card', [
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

export class AuthorCardComponent implements OnInit {
  @Input() author: Author
  @Output() selected = new EventEmitter<Author>()
  formatDate = formatDate

  constructor() { }

  ngOnInit() { }

  select() {
    this.selected.emit(this.author)
  }
}
