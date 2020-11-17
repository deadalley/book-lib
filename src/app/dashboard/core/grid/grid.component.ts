import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
  HostListener,
} from '@angular/core'
import { MOBILE_WIDTH } from 'utils/constants'

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent implements OnInit {
  innerWidth: number
  @Input() items: any[]
  @Input() itemsInRow = 4

  @ContentChild(TemplateRef) contentTemplate

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth
  }

  generateColumns() {
    if (this.innerWidth > MOBILE_WIDTH) {
      return 'auto '.repeat(this.itemsInRow)
    } else {
      return 'auto'
    }
  }
}
