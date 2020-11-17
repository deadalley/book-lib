import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ANIMATIONS } from 'utils/constants'
import { removeSpaces } from 'utils/helpers'
import { Author } from 'models/author.model'

@Component({
  moduleId: module.id,
  selector: 'authors-section',
  templateUrl: 'authors-section.component.html',
  styleUrls: ['authors-section.component.scss'],
  animations: [ANIMATIONS.CARD],
})
export class AuthorsSectionComponent implements OnInit {
  @Input() sectionId: string
  @Input() sectionTitle: string
  @Input() authors: Author[]

  @Input() clickable: boolean
  @Input() linkable: boolean
  @Input() cardsInRow = 4

  @Output() onClick = new EventEmitter<Author>()

  removeSpaces = removeSpaces
  displayAll = true

  ngOnInit() {}
}
