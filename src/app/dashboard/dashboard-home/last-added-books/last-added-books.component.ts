import { Component, OnInit, Input } from '@angular/core'
import { Book } from '../../../../interfaces/book'

@Component({
  moduleId: module.id,
  selector: 'last-added-books',
  templateUrl: 'last-added-books.component.html',
  styleUrls: ['./last-added-books.component.css']
})

export class LastAddedBooksComponent implements OnInit {
  @Input() latestBooks: Book[]

  ngOnInit() { }
}
