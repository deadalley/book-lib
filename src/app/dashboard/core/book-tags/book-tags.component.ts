import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'book-tags',
  templateUrl: 'book-tags.component.html',
  styleUrls: ['book-tags.component.css'],
})
export class BookTagsComponent implements OnInit {
  @Input() title: string
  @Input() placeholder: string
  @Input() iconClass: string
  @Input() items: string[]
  @Input() tags: boolean

  @Output() getItems = new EventEmitter<string[]>()
  @Output() hasFocus = new EventEmitter<boolean>()

  @ViewChild('tagInput') tagInput

  constructor() {}

  ngOnInit() {}

  pushItem(value) {
    if (value !== '') {
      this.items.push(value)
      this.getItems.emit(this.items)
    }
  }

  keyupHandle(event, value) {
    if (event.code === 'Comma' && value) {
      this.pushItem(value.slice(0, -1))
      this.tagInput.nativeElement.value = ''
    }
  }

  removeItem(index) {
    this.items.splice(index, 1)
    this.getItems.emit(this.items)
  }
}
