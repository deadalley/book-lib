import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { confirmPassword } from 'utils/validators'
import { AuthService } from 'services/auth.service'

@Component({
  moduleId: module.id,
  selector: 'sign-up',
  templateUrl: 'sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signUpForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: confirmPassword }
    )
  }

  ngOnInit() {}

  loginGoogle() {
    this.authService.loginGoogle()
  }

  loginFacebook() {
    this.authService.loginFacebook()
  }

  signUp(formValues) {
    console.log(formValues)
    this.authService.signUpWithEmail(formValues)
  }
}
