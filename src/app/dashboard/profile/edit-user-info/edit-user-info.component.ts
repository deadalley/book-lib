import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { User } from 'models/user.model'
import { ANIMATIONS } from 'utils/constants'
import { SessionService } from 'services/session.service'
import { DatabaseService } from 'services/database.service'
import { Router } from '@angular/router'

@Component({
  selector: 'edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class EditUserInfoComponent implements OnInit {
  user = {} as User
  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService,
    private databaseService: DatabaseService
  ) {
    this.user = this.sessionService.localUser
    this.form = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, Validators.required],
    })
  }

  ngOnInit() {}

  submit(formValues) {
    console.log('Updating user', formValues)

    this.databaseService
      .updateUser(this.user.id, formValues)
      .then(() => this.router.navigate(['dashboard/profile']))
  }
}
