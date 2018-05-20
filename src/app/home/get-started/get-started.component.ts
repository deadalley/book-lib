import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { AuthService } from '../../../services/auth.service'

@Component({
  moduleId: module.id,
  selector: 'get-started',
  templateUrl: 'get-started.component.html',
  styleUrls: ['get-started.component.css']
})

export class GetStartedComponent implements OnInit {
  errorMessage: string

  @Output() loadComponent = new EventEmitter<string>()

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  loginGoogle() {
    this.authService.loginGoogle()
  }

  loginFacebook() {
    this.authService.loginFacebook()
  }

  loginEmail() {
    this.loadComponent.emit('signin')
  }
}
