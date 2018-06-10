import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Author } from 'interfaces/author'
import { formatDate } from 'utils/helpers'
import { ANIMATIONS } from 'utils/constans'

@Component({
  selector: 'author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.css'],
  animations: [ANIMATIONS.CARD]
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
