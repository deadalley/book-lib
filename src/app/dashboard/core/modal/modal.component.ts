import { Component, TemplateRef, OnInit, Input, ViewChild } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  @Input() title: string
  @Input() content: string
  @Input() cancel: string
  @Input() accept: string
  @Input() onAccept: Function
  modalRef: BsModalRef

  @ViewChild('modalTemplate') template: TemplateRef<any>

  constructor(private modalService: BsModalService) { }

  openModal() {
    this.modalRef = this.modalService.show(this.template)
  }

  closeModal(f: Function) {
    this.modalRef.hide()
    if (f) { f() }
  }

  ngOnInit() { }
}
