import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'book-button',
  templateUrl: './book-button.component.html',
  styleUrls: ['./book-button.component.scss'],
})
export class BookButtonComponent implements OnInit {
  @Input() iconClass: string
  @Input() active = false

  ngOnInit(): void {}
}
