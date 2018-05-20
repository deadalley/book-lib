import { Component, OnInit, Input, Output, EventEmitter, trigger, transition, style, animate, group, state, OnDestroy } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms'
import { DatabaseService } from 'services/database.service'
import { AuthService } from 'services/auth.service'

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

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      name: '',
    })
  }

  ngOnInit() { }

  ngOnDestroy() { }

  submit(formValues) {
    console.log('Updating user', formValues)
  }

  loginGoodreads() {
    this.authService.loginGoodreads()
  }
}
