import { Component, OnInit, Input } from '@angular/core'

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  @Input() identifier: string
  @Input() title: string
  @Input() content: string
  @Input() cancel: string
  @Input() accept: string
  @Input() onAccept: Function

  ngOnInit() { }
}
