import { Component, OnInit, Input } from '@angular/core'
import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  moduleId: module.id,
  selector: 'search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.css'],
})
export class SearchBoxComponent implements OnInit {
  @Input() withMargin = false
  @Input() items = []
  @Input() props = { main: 'title', sub: 'author' }
  @Input() searchProps = ['title', 'author', 'original']
  searchInput: FormControl = new FormControl()
  searchValue

  ngOnInit() {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(value => (this.searchValue = value))
  }
}
