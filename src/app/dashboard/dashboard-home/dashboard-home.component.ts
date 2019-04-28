import { Component, OnInit } from '@angular/core'
import { ANIMATIONS } from 'utils/constants'
import { SessionService } from 'services/session.service'
import { filter } from 'rxjs/operators'
import { notify } from 'utils/notifications'
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class DashboardHomeComponent implements OnInit {
  displayWelcomeMessage = false

  constructor(private sessionService: SessionService) {
    this.sessionService.localUser$
      .pipe(filter(user => !!user))
      .subscribe(
        user => (this.displayWelcomeMessage = user.displayWelcomeMessage)
      )
  }

  ngOnInit() {}

  notify() {
    notify({ title: 'ehy', message: 'message' })
  }
}
