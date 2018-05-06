import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'book-tags',
  templateUrl: 'book-tags.component.html',
  styleUrls: []
})

export class BookTagsComponent implements OnInit {
  @Input() title: string
  @Input() placeholder: string
  @Input() iconClass: string
  @Input() items: Array<string>

  @Output() getItems = new EventEmitter<Array<string>>()

  constructor() { }

  ngOnInit() {
    this.items = []
  }

  pushItem(value) {
    if (value !== '') {
      this.items.push(value)
      this.getItems.emit(this.items)
    }
  }

  removeItem(index) {
    this.items.splice(index, 1)
    this.getItems.emit(this.items)
  }
}
