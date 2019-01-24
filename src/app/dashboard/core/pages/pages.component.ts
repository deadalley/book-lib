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
  pages = []

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => (this.selectedPage = +params.page)
    )
  }

  ngOnChanges() {
    this.pages = new Array(this.count).fill(0).map((_x, i) => i + 1)
  }

  onClick(page: number) {
    const queryParams: Params = {
      ...this.route.snapshot.queryParams,
      page,
    }
    this.router.navigate(['.'], { relativeTo: this.route, queryParams })
  }
}
