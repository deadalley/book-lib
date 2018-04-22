import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Router } from '@angular/router'
import * as firebase from 'firebase/app'
import { User } from '../interfaces/user'
import { Book } from '../interfaces/book'

@Injectable()
export class DatabaseService {
  private users: AngularFireList<User>
  private books: AngularFireList<Book>

  constructor (private db: AngularFireDatabase) {
    this.books = db.list('books')
    this.users = db.list('users')
  }

  findUserById(id: number, cb) {
    this.users.query.orderByChild('id').equalTo(id).once('value', (snap) => cb(snap.val()))
  }

  getBooksByIds(ids: number[], cb) {
    this.books.valueChanges().subscribe((books) => cb(ids ? books.filter((book) => ids.includes(book['id'])) : []))
  }

  pushUser(user: User) {
    this.users.push(user)
  }

  pushBook(book: Book) {
    this.books.push(book)
  }
}
