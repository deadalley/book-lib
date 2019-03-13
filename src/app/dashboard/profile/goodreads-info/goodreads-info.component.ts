import { Component, OnInit, Input } from '@angular/core'
import { User } from 'models/user.model'
import { ANIMATIONS } from 'utils/constants'
import { AuthService } from 'services/auth.service'
import { SessionService } from 'services/session.service'

@Component({
  selector: 'goodreads-info',
  templateUrl: './goodreads-info.component.html',
  styleUrls: ['./goodreads-info.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class GoodreadsInfoComponent implements OnInit {
  @Input() user: User
  connectedToGoodreads: boolean

  constructor(
    private authService: AuthService,
    private sessionService: SessionService
  ) {
    this.user = this.sessionService.localUser
    this.connectedToGoodreads = !!this.user.goodreadsId
  }

  ngOnInit() {}

  loginGoodreads() {
    this.authService.loginGoodreads()
  }
}
