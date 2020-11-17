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
  @Input() maxCount = 5
  @Input() selectedPage = 3
  @Input() withRoute = false
  @Output() nextSelectedPage = new EventEmitter<number>()
  pages: Array<number | string> = []

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.withRoute) {
      this.route.queryParams.subscribe(
        params =>
          (this.selectedPage = params.page
            ? +params.page
            : this.selectedPage || 1)
      )
    }
    this.calculatePages()
  }

  ngOnChanges() {
    if (this.selectedPage > this.count) {
      this.selectedPage = this.count
    }
  }

  calculatePages() {
    this.pages = new Array(this.count).fill(0).map((_x, i) => i + 1)
    if (this.count > 5) {
      if (this.selectedPage < 5) {
        this.pages.splice(5, this.count - 6, '...')
      } else if (this.selectedPage >= this.count - 3) {
        this.pages.splice(1, this.count - 6, '...')
      } else {
        this.pages.splice(1, this.selectedPage - 3, '...')
        this.pages.splice(5, this.pages.length - 6, '...')
      }
    }
  }

  onClick(page: number) {
    const lastPage = page === this.count + 1
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
      this.calculatePages()
    }
  }
}
