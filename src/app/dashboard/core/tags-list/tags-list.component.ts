import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'tags-list',
  templateUrl: 'tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
})
export class TagsListComponent implements OnInit {
  @Input() tags: string[]
  @Output() selectedTags = new EventEmitter<string[]>()
  _selectedTags = {}

  ngOnInit() {
    if (this.tags && this.tags.length) {
      this._selectedTags = this.tags.reduce((value, tag) => {
        value[tag] = false
        return value
      }, {})
      this.selectedTags.emit(this.filterSelectedTags())
    }
  }

  onClick(tag: string) {
    this._selectedTags[tag] = !this._selectedTags[tag]
    this.selectedTags.emit(this.filterSelectedTags())
  }

  filterSelectedTags() {
    return Object.keys(this._selectedTags).filter(
      tag => this._selectedTags[tag]
    )
  }
}
