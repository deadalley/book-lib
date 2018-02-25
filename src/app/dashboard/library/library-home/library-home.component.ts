import { Component, OnInit, trigger, transition, style, animate, group, state,  } from '@angular/core'
import BookFactory from '../../../../factories/book'
import { FactoryArray } from '../../../../factories/utils'

@Component({
    moduleId: module.id,
    selector: 'library-home-cmp',
    templateUrl: 'library-home.component.html',
    styleUrls: [
      '../library.component.css',
      './library-home.component.css'
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

export class LibraryHomeComponent implements OnInit {
  books = BookFactory.buildList(10)
  tilesDisplay = true

  ngOnInit() {
    const books = this.books
  }
}
