import { Component, OnInit, Input } from '@angular/core'

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'loading',
  templateUrl: 'loading.component.html',
  styleUrls: ['loading.component.css'],
})
export class LoadingComponent implements OnInit {
  @Input() visible = false

  ngOnInit() {}
}
