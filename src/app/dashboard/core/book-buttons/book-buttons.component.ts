import { Component, OnInit, Input } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'book-buttons',
  templateUrl: 'book-buttons.component.html',
  styleUrls: ['./book-buttons.component.scss'],
})
export class BookButtonsComponent implements OnInit {
  @Input() owned = false
  @Input() read = false
  @Input() favorite = false
  @Input() wishlist = false

  ngOnInit() {}

  getValues() {
    return {
      owned: this.owned,
      read: this.read,
      favorite: this.favorite,
      wishlist: this.wishlist,
    }
  }
}
