import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { User } from 'models/user.model'
import { ANIMATIONS } from 'utils/constants'
import { AuthService } from 'services/auth.service'
import { SessionService } from 'services/session.service'

@Component({
  selector: 'delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class DeleteAccountComponent implements OnInit {
  @Input() user: User

  @ViewChild('deleteAccountModal', { static: false }) modal

  constructor(
    private authService: AuthService,
    private sessionService: SessionService
  ) {
    this.user = this.sessionService.localUser
  }

  ngOnInit() {}

  confirmDeleteAccount() {
    this.modal.openModal()
  }

  deleteAccount() {
    this.authService.deleteAccount()
  }
}
