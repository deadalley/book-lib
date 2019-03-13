import { Component, OnInit } from '@angular/core'
import { User } from 'models/user.model'
import { SessionService } from 'services/session.service'
import { LibraryService } from 'services/library.service'
import { ANIMATIONS } from 'utils/constants'

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class UserInfoComponent implements OnInit {
  user: User
  bookCount: number
  collectionCount: number

  constructor(
    private sessionService: SessionService,
    private libraryService: LibraryService
  ) {
    this.user = this.sessionService.localUser
    this.libraryService.bookCount$.subscribe(count => (this.bookCount = count))
    this.libraryService.collectionCount$.subscribe(
      count => (this.collectionCount = count)
    )
  }

  ngOnInit() {}
}
