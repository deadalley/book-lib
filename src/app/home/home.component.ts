import { Component, OnInit } from '@angular/core'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  componentToLoad = 'getstarted'

  set setComponentToLoad(component: string) {
    this.componentToLoad = component
  }

  constructor(private authService: AuthService) { }

  ngOnInit() { }
}
