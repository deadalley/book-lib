import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { DEFAULT_TABLE_ITEMS } from 'utils/constants'

@Component({
  moduleId: module.id,
  selector: 'table-items',
  templateUrl: 'table-items.component.html',
  styleUrls: ['./table-items.component.css'],
})
export class TableItemsComponent implements OnInit {
  @Input()
  items = DEFAULT_TABLE_ITEMS
  itemNames: string[]
  @Output() displayItems = new EventEmitter<object>()

  ngOnInit() {
    this.itemNames = Object.keys(this.items)
    this.displayItems.emit(this.items)
  }

  onClick(name: string) {
    this.items[name] = !this.items[name]
    this.displayItems.emit(this.items)
  }
}
