import { Component, OnInit, Input } from '@angular/core'
import { ANIMATIONS } from 'utils/constants'

@Component({
  selector: 'popover-container',
  templateUrl: './popover-container.component.html',
  styleUrls: ['./popover-container.component.css'],
  animations: [ANIMATIONS.POPOVER],
})
export class PopoverContainerComponent implements OnInit {
  @Input() show: boolean

  ngOnInit() {}
}
