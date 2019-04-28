import { Component, OnInit, Input } from '@angular/core'

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'loading-overlay',
  templateUrl: 'loading-overlay.component.html',
  styleUrls: ['loading-overlay.component.css'],
})
export class LoadingOverlayComponent implements OnInit {
  @Input() visible = false

  ngOnInit() {}
}
