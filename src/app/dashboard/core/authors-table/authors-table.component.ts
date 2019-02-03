import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ANIMATIONS } from 'utils/constants'
import { Author } from 'models/author.model'

@Component({
  moduleId: module.id,
  selector: 'authors-table',
  templateUrl: 'authors-table.component.html',
  styleUrls: ['./authors-table.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class AuthorsTableComponent implements OnInit {
  @Input() sectionTitle: string
  @Input() authors: Author[]
  @Input() clickable: boolean
  @Input() linkable: boolean

  @Output() onClick = new EventEmitter<Author>()

  ngOnInit() {}
}
