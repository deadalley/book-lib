import { Component, OnInit } from '@angular/core'
import { ANIMATIONS } from 'utils/constans'

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  animations: [ANIMATIONS.CARD]
})
export class DashboardHomeComponent implements OnInit {
  ngOnInit() { }
}
