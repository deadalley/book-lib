import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core'

@Component({
  moduleId: module.id,
  selector: 'grid',
  templateUrl: 'grid.component.html',
  styleUrls: []
})

export class GridComponent implements OnInit {
  @Input() items: Array<any>
  @Input() itemsInRow = 4

  @ContentChild(TemplateRef) contentTemplate

  ngOnInit() { }
}