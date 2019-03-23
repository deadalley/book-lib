import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ANIMATIONS } from 'utils/constants'

@Component({
  selector: 'popover-container',
  templateUrl: './popover-container.component.html',
  styleUrls: ['./popover-container.component.css'],
  animations: [ANIMATIONS.POPOVER],
})
export class PopoverContainerComponent implements OnInit {
  @Input() label: string
  @Input() bold: boolean
  @Input() show: boolean

  @Output() selected = new EventEmitter<string>()

  ngOnInit() {
    this.show = false
  }

  onClick(event) {
    event.stopPropagation()
    this.show = true
    this.selected.emit(this.label)
  }
}
