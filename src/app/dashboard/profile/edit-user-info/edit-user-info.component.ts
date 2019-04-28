import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { User } from 'models/user.model'
import { ANIMATIONS } from 'utils/constants'
import { SessionService } from 'services/session.service'
import { DatabaseService } from 'services/database.service'
import { Router } from '@angular/router'
import { mergeMap, last } from 'rxjs/operators'
import { notify } from 'utils/notifications'

@Component({
  selector: 'edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class EditUserInfoComponent implements OnInit {
  user = {} as User
  nameForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService,
    private databaseService: DatabaseService
  ) {
    this.user = this.sessionService.localUser
    this.nameForm = this.fb.group({
      name: [this.user.name, Validators.required],
    })
  }

  ngOnInit() {}

  submit(formValues) {
    console.log('Updating user', formValues)

    this.databaseService
      .updateUser(this.user.id, formValues)
      .then(() => notify({ message: 'User profile succesfully updated' }))
      .then(() => this.router.navigate(['dashboard/profile']))
  }

  uploadImage(event) {
    this.databaseService
      .uploadAvatar(this.sessionService.userId, event.target.files[0])
      .pipe(
        mergeMap<any, any>(imagePath =>
          this.databaseService.updateUser(this.sessionService.userId, {
            avatarUrl: imagePath,
          })
        ),
        last()
      )
      .subscribe(e => {
        console.log(e)
        notify({ message: 'Avatar succesfully updated' })
        this.user = this.sessionService.localUser
      })
  }
}
