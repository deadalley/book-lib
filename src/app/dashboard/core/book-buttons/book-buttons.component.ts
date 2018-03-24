import { Component, OnInit } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'book-buttons',
  templateUrl: 'book-buttons.component.html',
  styleUrls: ['./book-buttons.component.css']
})

export class BookButtonsComponent implements OnInit {
  owned = false
  read = false
  favorite = false

  ngOnInit() { }

  getValues() { return { owned: this.owned, read: this.read, favorite: this.favorite } }
}
