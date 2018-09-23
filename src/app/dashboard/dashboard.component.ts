import { Component, OnInit } from '@angular/core'
import { SessionService } from 'services/session.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
    this.sessionService.buildSession()
  }
}
