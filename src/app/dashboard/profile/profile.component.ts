import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ANIMATIONS } from 'utils/constants'
import { DatabaseService } from 'services/database.service'
import { AuthService } from 'services/auth.service'
import { User } from 'models/user.model'
import { SessionService } from 'services/session.service'

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
  isLoading = true
  connectedToGoodreads = false

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    })
    this.databaseService.findUserById(this.sessionService.userId).then(user => {
      this.user = user
      this.isLoading = false
      this.connectedToGoodreads = !!user.goodreadsId
      this.form.patchValue({ name: this.user.name })
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
