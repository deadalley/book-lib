import { Component, OnInit, Input, Output, EventEmitter, trigger, transition, style, animate, group, state, OnDestroy } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms'
import { DatabaseService } from 'services/database.service'
import { AuthService } from 'services/auth.service'
import { User } from 'interfaces/user'

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('card', [
      state('*', style({
        '-ms-transform': 'translate3D(0px, 0px, 0px)',
        '-webkit-transform': 'translate3D(0px, 0px, 0px)',
        '-moz-transform': 'translate3D(0px, 0px, 0px)',
        '-o-transform': 'translate3D(0px, 0px, 0px)',
        transform: 'translate3D(0px, 0px, 0px)',
        opacity: 1})),
        transition('void => *', [
          style({opacity: 0,
            '-ms-transform': 'translate3D(0px, 150px, 0px)',
            '-webkit-transform': 'translate3D(0px, 150px, 0px)',
            '-moz-transform': 'translate3D(0px, 150px, 0px)',
            '-o-transform': 'translate3D(0px, 150px, 0px)',
            transform: 'translate3D(0px, 150px, 0px)',
          }),
          animate('0.3s 0s ease-out')
        ])
    ])
  ]
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

  ngOnInit() { }

  ngOnDestroy() { }

  submit(formValues) {
    console.log('Updating user', formValues)

    this.databaseService.updateUser(this.user.id, { name: formValues.name })
  }

  loginGoodreads() {
    this.authService.loginGoodreads()
  }
}
