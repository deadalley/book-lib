import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'pages',
  templateUrl: 'pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit, OnChanges {
  @Input() count = 1
  selectedPage = 1
  @Input() withRoute = true
  @Output() nextSelectedPage = new EventEmitter<number>()
  pages = []

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.withRoute &&
      this.route.queryParams.subscribe(
        params => (this.selectedPage = params.page ? +params.page : 1)
      )
  }

  ngOnChanges() {
    this.pages = new Array(this.count).fill(0).map((_x, i) => i + 1)
    if (this.selectedPage > this.count) {
      this.selectedPage = this.count
    }
  }

  onClick(page: number) {
    const lastPage = page - 1 === this.pages[this.pages.length - 1]
    const firstPage = page === 0
    if (firstPage || lastPage) {
      return
    }
    if (this.withRoute) {
      const queryParams: Params = {
        ...this.route.snapshot.queryParams,
        page,
      }
      this.router.navigate(['.'], { relativeTo: this.route, queryParams })
    } else {
      this.selectedPage = page
      this.nextSelectedPage.emit(page)
    }
  }
}
