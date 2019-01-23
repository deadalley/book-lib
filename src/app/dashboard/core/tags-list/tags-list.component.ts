import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'tags-list',
  templateUrl: 'tags-list.component.html',
  styleUrls: ['./tags-list.component.css'],
})
export class TagsListComponent implements OnInit {
  @Input() tags: string[]
  @Output() selectedTags = new EventEmitter<object>()
  _selectedTags = {}

  ngOnInit() {
    this._selectedTags = this.tags.reduce((value, tag) => {
      value[tag] = false
      return value
    }, {})
    this.selectedTags.emit(this._selectedTags)
  }

  onClick(tag: string) {
    this._selectedTags[tag] = !this._selectedTags[tag]
    this.selectedTags.emit(this._selectedTags)
  }
}
