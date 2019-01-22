import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'table-items',
  templateUrl: 'table-items.component.html',
  styleUrls: ['./table-items.component.css'],
})
export class TableItemsComponent implements OnInit {
  items = {
    Cover: true,
    'Original title': false,
    Author: true,
    'Added on': false,
    Year: false,
    Publisher: false,
    Language: false,
    Pages: false,
    Rating: false,
    Favorites: true,
  }
  itemNames = Object.keys(this.items)
  @Output() displayItems = new EventEmitter<object>()

  ngOnInit() {
    this.displayItems.emit(this.items)
  }

  onClick(name: string) {
    this.items[name] = !this.items[name]
    this.displayItems.emit(this.items)
  }
}
