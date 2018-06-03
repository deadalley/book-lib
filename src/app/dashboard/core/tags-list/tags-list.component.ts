import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'tags-list',
  templateUrl: 'tags-list.component.html',
  styleUrls: [],
})

export class TagsListComponent implements OnInit {
  @Input() tags: string[]
  @Output() selectedTag = new EventEmitter<string>()

  ngOnInit() { }
}
