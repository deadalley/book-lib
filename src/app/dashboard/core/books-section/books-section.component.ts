import { Component, OnInit, Input, Output, EventEmitter, trigger, transition, style, animate, state } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Book } from 'interfaces/book'

@Component({
  moduleId: module.id,
  selector: 'books-section',
  templateUrl: 'books-section.component.html',
  styleUrls: [],
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

export class BooksSectionComponent implements OnInit {
  @Input() sectionTitle: string
  @Input() description: string
  @Input() books: Book[]
  @Input() withButtons: boolean
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() selectable: boolean
  @Input() selectBtnContent: string
  @Input() selectBtnContentDisabled: string
  @Output() selectedBooks = new EventEmitter<Array<Book>>()
  @Output() selectedBook = new EventEmitter<Book>()

  ngOnInit() { }

  updateSelectedBooks(selectedBook: Book) {
    this.selectedBook.emit(selectedBook)
    this.selectedBooks.emit(this.books.filter((book) => book.isSelected))
  }

  removeSpaces(title: string) {
    return title.replace(/\s/g, '')
  }
}
