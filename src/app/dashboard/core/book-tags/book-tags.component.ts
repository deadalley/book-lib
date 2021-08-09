import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { FormControl } from '@angular/forms'

@Component({
  moduleId: module.id,
  selector: 'book-tags',
  templateUrl: 'book-tags.component.html',
  styleUrls: ['book-tags.component.scss'],
})
export class BookTagsComponent implements OnInit {
  @Input() title: string
  @Input() placeholder: string
  @Input() iconClass?: string
  @Input() items: string[]
  @Input() tags: boolean
  @Input() suggestions?: string[]

  @Output() getItems = new EventEmitter<string[]>()
  @Output() hasFocus = new EventEmitter<boolean>()

  @ViewChild('tagInput', { static: false }) tagInput: any

  tagInputValue: FormControl = new FormControl()
  filteredSuggestions: string[] = []
  debouncedHasFocus: boolean
  searchValue: string

  constructor() {}

  ngOnInit() {
    console.log('CONST', this.suggestions)
    this.hasFocus
      .pipe(debounceTime(100))
      .subscribe(value => (this.debouncedHasFocus = value))

    this.tagInputValue.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchValue = value
        if (!value) {
          this.filteredSuggestions = []
        } else {
          this.filteredSuggestions = this.suggestions.filter(
            suggestion => !this.items.includes(suggestion)
          )
        }
        console.log(value, this.filteredSuggestions, this.suggestions)
      })

    this.getItems.subscribe((array: string[]) => {
      if (!this.searchValue) {
        return (this.filteredSuggestions = [])
      }
      this.filteredSuggestions = this.suggestions.filter(
        suggestion => !array.includes(suggestion)
      )
    })
  }

  pushItem(value: string) {
    if (value !== '') {
      this.items.push(value)
      this.getItems.emit(this.items)
    }
  }

  keyupHandle(event: KeyboardEvent, value: string) {
    if (event.code === 'Comma' && value) {
      this.pushItem(value.slice(0, -1))
      this.tagInput.nativeElement.value = ''
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1)
    this.getItems.emit(this.items)
  }
}
