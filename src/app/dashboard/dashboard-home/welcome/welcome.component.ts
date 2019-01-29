import { Component, OnInit } from '@angular/core'
import { DatabaseService } from 'services/database.service'
import { SessionService } from 'services/session.service'

@Component({
  moduleId: module.id,
  selector: 'welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  constructor(
    private databaseService: DatabaseService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {}

  hideMessage() {
    const userId = this.sessionService.userId
    this.databaseService.updateUser(userId, { displayWelcomeMessage: false })
  }
}
