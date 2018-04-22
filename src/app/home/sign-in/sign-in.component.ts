import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
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
}
