import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { mergeMap, last } from 'rxjs/operators'
import { User } from 'models/user.model'
import { ANIMATIONS } from 'utils/constants'
import { SessionService } from 'services/session.service'
import { DatabaseService } from 'services/database.service'
import { AuthService } from 'services/auth.service'
import { notify } from 'utils/notifications'
import { confirmPassword, confirmEmail } from 'utils/validators'

@Component({
  selector: 'edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class EditUserInfoComponent implements OnInit {
  user = {} as User
  form: FormGroup
  imageChangedEvent: any
  croppedImage: any
  isLoading = false
  isLoadingAvatar = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService,
    private databaseService: DatabaseService
  ) {
    this.user = this.sessionService.localUser
    this.form = this.fb.group(
      {
        name: [this.user.name, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        oldPassword: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: [confirmPassword, confirmEmail] }
    )
  }

  ngOnInit() {}

  updateName({ name }: { name: string }) {
    console.log('Updating user', name)

    this.databaseService
      .updateUser(this.user.id, { name })
      .then(() => notify({ message: 'User profile succesfully updated' }))
      .then(() => this.router.navigate(['dashboard/profile']))
  }

  updateEmail({ email, password }: { email: string; password: string }) {
    console.log('Updating user', email)

    this.authService
      .updateUserEmail(email, password)
      .then(() => notify({ message: 'User profile succesfully updated' }))
      .then(() => this.router.navigate(['dashboard/profile']))
  }

  updatePassword({
    password,
    oldPassword,
  }: {
    password: string
    oldPassword: string
  }) {
    console.log('Updating user', password)

    this.authService
      .updateUserPassword(oldPassword, password)
      .then(() => notify({ message: 'User profile succesfully updated' }))
      .then(() => this.router.navigate(['dashboard/profile']))
  }

  imageChanged(event) {
    this.imageChangedEvent = event
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.file
  }

  uploadBackground(image) {
    if (!image) {
      return
    }
    this.isLoading = true
    this.databaseService
      .uploadBackgroundImage(this.sessionService.userId, image)
      .pipe(
        mergeMap<any, any>(imagePath =>
          this.databaseService.updateUser(this.sessionService.userId, {
            backgroundUrl: imagePath,
          })
        ),
        last()
      )
      .subscribe(e => {
        notify({ message: 'Background image succesfully updated' })
        this.user = this.sessionService.localUser
        this.isLoading = false
        this.imageChanged(null)
        this.croppedImage = null
      })
  }

  uploadAvatar(event) {
    this.isLoadingAvatar = true
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
        notify({ message: 'Avatar succesfully updated' })
        this.user = this.sessionService.localUser
        this.isLoadingAvatar = false
      })
  }
}
