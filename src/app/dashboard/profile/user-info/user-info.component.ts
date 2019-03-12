import { Component, OnInit } from '@angular/core'
import { User } from 'models/user.model'
import { SessionService } from 'services/session.service'
import { ANIMATIONS } from 'utils/constants'

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class UserInfoComponent implements OnInit {
  user: User

  constructor(private sessionService: SessionService) {
    this.user = this.sessionService.localUser
  }

  ngOnInit() {}
}
