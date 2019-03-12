import { Component, OnInit, Input } from '@angular/core'
import { User } from 'models/user.model'
import { ANIMATIONS } from 'utils/constants'
import { AuthService } from 'services/auth.service'

@Component({
  selector: 'goodreads-info',
  templateUrl: './goodreads-info.component.html',
  styleUrls: ['./goodreads-info.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class GoodreadsInfoComponent implements OnInit {
  @Input() user: User

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  loginGoodreads() {
    this.authService.loginGoodreads()
  }
}
