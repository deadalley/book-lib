import { Component, OnInit } from '@angular/core'
import { environment } from 'environments/environment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  componentToLoad = 'getstarted'
  environment = environment

  set setComponentToLoad(component: string) {
    this.componentToLoad = component
  }

  ngOnInit() {}
}
