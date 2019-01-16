import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { ANIMATIONS } from 'utils/constants'
import { DatabaseService } from 'services/database.service'
import { AuthService } from 'services/auth.service'
import { User } from 'models/user.model'

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class ProfileComponent implements OnInit, OnDestroy {
  form: FormGroup
  user: User
  connectedToGoodreads = false

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {
    this.user = JSON.parse(localStorage.getItem('user'))
    if (!this.user) {
      console.log('Could not find local user')
    }
    this.connectedToGoodreads = !!this.user.goodreadsId

    this.form = this.fb.group({
      name: this.user.name,
    })
  }

  ngOnInit() {}

  ngOnDestroy() {}

  submit(formValues) {
    console.log('Updating user', formValues)

    this.databaseService.updateUser(this.user.id, { name: formValues.name })
  }

  loginGoodreads() {
    this.authService.loginGoodreads()
  }
}
