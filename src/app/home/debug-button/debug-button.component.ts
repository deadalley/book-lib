import { Component, OnInit } from '@angular/core'
import { DatabaseService } from 'services/database.service'
import UserFactory from 'factories/user'

@Component({
  selector: 'debug-button',
  templateUrl: './debug-button.component.html',
  styleUrls: [],
})
export class DebugButtonComponent implements OnInit {
  constructor(private database: DatabaseService) {}

  ngOnInit() {}

  async testUser() {
    const user = {
      uid: 'uid',
      name: 'a name',
      email: 'email@email.com',
      books: [],
      collections: [],
      goodreadsId: 'goodreadsId',
    }
    const createdUser = await this.database.createUser(user)
    console.log(createdUser)
    const foundUser = await this.database.findUserById(createdUser.id)
    console.log(foundUser)
    const updatedUser = await this.database.updateUser(foundUser.id, {
      name: 'updated',
      books: ['aaa'],
    })
    console.log(updatedUser)
  }

  async testBook() {
    const pushBook = this.database
      .userBooksRef('-LVURxjSOGjpXGf2DYgZ')
      .push('aaaaaa')
    const books = await this.database
      .userBooksRef('-LVURxjSOGjpXGf2DYgZ')
      .query.once('value')
      .then(snap => snap.val())
    console.log(pushBook)
    console.log(books)
  }

  execute() {
    this.testBook()
  }
}
