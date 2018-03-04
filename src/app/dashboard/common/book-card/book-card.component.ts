import { Component, OnInit, Input, trigger, transition, style, animate, group, state } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Book } from '../../../../interfaces/book'
import { TooltipModule } from 'ngx-tooltip'

@Component({
  selector: 'book-card',
  templateUrl: './book-card.component.html',
  styleUrls: [
    './book-card.component.css',
  ],
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

export class BookCardComponent implements OnInit {
  @Input() book: Book

  constructor() { }

  ngOnInit() { }
}
