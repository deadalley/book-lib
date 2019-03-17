import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms'
import { AuthService } from '../../../services/auth.service'

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
        signUpName: ['', [Validators.required]],
        signUpEmail: ['', [Validators.required, Validators.email]],
        signUpPassword: ['', [Validators.required, Validators.minLength(6)]],
        signUpConfirmPassword: [
          '',
          [Validators.required, Validators.minLength(6)],
        ],
      },
      { validator: this.confirmPassword }
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
    this.authService.signUpWithEmail(formValues)
  }

  confirmPassword(control: AbstractControl): { passwordMismatch: boolean } {
    const password = control.get('signUpPassword').value
    const passwordConfirm = control.get('signUpConfirmPassword').value

    if (password !== passwordConfirm) {
      control.get('signUpConfirmPassword').setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }
}
