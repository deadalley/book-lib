import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Author } from 'models/author.model'
import { ANIMATIONS } from 'utils/constants'

@Component({
  selector: 'author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.scss'],
  animations: [ANIMATIONS.CARD],
})
export class AuthorCardComponent implements OnInit {
  @Input() author: Author & any
  @Input() clickable: boolean
  @Input() linkable: boolean
  @Output() onClick = new EventEmitter<Author>()

  constructor() {}

  ngOnInit() {}

  select() {
    if (!this.clickable) {
      return
    }
    this.onClick.emit(this.author)
  }
}
