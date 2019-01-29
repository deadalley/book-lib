import { Component, OnInit } from '@angular/core'
import { ANIMATIONS } from 'utils/constants'
import { SessionService } from 'services/session.service'

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class DashboardHomeComponent implements OnInit {
  displayWelcomeMessage = false

  constructor(private sessionService: SessionService) {
    this.displayWelcomeMessage = this.sessionService.localUser.displayWelcomeMessage
  }

  ngOnInit() {}
}
