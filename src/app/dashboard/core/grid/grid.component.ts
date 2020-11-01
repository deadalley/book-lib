import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
  ViewChild,
} from '@angular/core'

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent implements OnInit {
  @Input() items: any[]
  @Input() itemsInRow = 4

  // @ViewChild(TemplateRef) contentTemplate
  @ContentChild(TemplateRef) contentTemplate
  // @ContentChild(TemplateRef) puppyTemplate: TemplateRef<NgForOfContext<Puppy>>;

  gridColumns = {}

  ngOnInit() {
    const divider = `col-md-${12 / this.itemsInRow}`
    this.gridColumns[divider] = true
  }
}
