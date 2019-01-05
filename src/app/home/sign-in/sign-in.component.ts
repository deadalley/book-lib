import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AuthService } from '../../../services/auth.service'
import { parseFirebaseAuthError } from '../../../utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  form: FormGroup
  errorMessage: string
  @Output() loadComponent = new EventEmitter<string>()

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit() { }

  signIn(formValues) {
    this.authService.loginEmail(formValues, (error) => {
      this.errorMessage = parseFirebaseAuthError(error)
      console.log(this.errorMessage)
    })
  }

  signUp() {
    this.loadComponent.emit('signup')
  }

  goBack() {
    this.loadComponent.emit('getstarted')
  }
}
