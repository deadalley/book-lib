import { Component, OnInit, OnDestroy } from '@angular/core'
import { User } from 'models/user.model'
import { SessionService } from 'services/session.service'
import { LibraryService } from 'services/library.service'
import { AuthService } from 'services/auth.service'
import { ANIMATIONS } from 'utils/constants'

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class UserInfoComponent implements OnInit, OnDestroy {
  subscriptions = []
  user: User
  bookCount: number
  collectionCount: number
  isVerified = true
  signInMethod: any = {}

  SIGN_IN_METHODS = {
    'google.com': {
      icon: 'ti-google',
      text: 'Connected to Google',
    },
    'facebook.com': {
      icon: 'ti-facebook',
      text: 'Connected to Facebook',
    },
  }

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private libraryService: LibraryService
  ) {
    this.user = this.sessionService.localUser
    this.subscriptions.push(
      this.libraryService.bookCount$.subscribe(
        count => (this.bookCount = count)
      )
    )
    this.subscriptions.push(
      this.libraryService.collectionCount$.subscribe(
        count => (this.collectionCount = count)
      )
    )
  }

  ngOnInit() {
    this.authService.userLoaded.subscribe(value => {
      if (value) {
        this.isVerified = this.authService.userIsVerified
        this.signInMethod = this.SIGN_IN_METHODS[
          this.authService.signInProvider()
        ]
      }
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  sendVerificationEmail() {
    this.authService.sendVerificationEmail()
  }
}
