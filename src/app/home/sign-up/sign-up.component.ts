import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { AuthService } from '../../../services/auth.service'

@Component({
  moduleId: module.id,
  selector: 'sign-up',
  templateUrl: 'sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {
  form: FormGroup

  @Output() loadComponent = new EventEmitter<string>()

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validator: this.confirmPassword })
  }

  ngOnInit() { }

  confirmPassword(control: AbstractControl): { passwordMismatch: boolean } {
    const password = control.get('password').value
    const passwordConfirm = control.get('confirmPassword').value

    if (password !== passwordConfirm) {
      control.get('confirmPassword').setErrors({ passwordMismatch: true})
      return { passwordMismatch: true }
    }

    return null
  }

  signUp(formValues) {
    this.authService.signUpWithEmail(formValues)
  }

  goBack() {
    this.loadComponent.emit('signin')
  }
}
