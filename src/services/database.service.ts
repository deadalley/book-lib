import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database'
import { Router } from '@angular/router'
import * as firebase from 'firebase/app'
import { User } from '../models/user'
import { Book } from '../models/book'

@Injectable()
export class DatabaseService {
  private users: AngularFireList<User>
  private books: AngularFireList<Book>

  private userRef(userRef: string): AngularFireObject<User> {
    return this.db.object(`users/${userRef}`)
  }

  private userBooksRef(userRef: string): AngularFireList<User.Book> {
    return this.db.list(`users/${userRef}/books`)
  }

  private userCollectionsRef(userRef: string): AngularFireList<User.Collection> {
    return this.db.list(`users/${userRef}/collections`)
  }

  constructor (private db: AngularFireDatabase) {
    this.books = db.list('books')
    this.users = db.list('users')
  }

  findUserById(id: number, cb) {
    this.users.query.orderByChild('id').equalTo(id).once('value', (snap) => cb(snap.val()))
  }

  getBooksByIds(ids: string[], cb) {
    this.books.valueChanges().subscribe((books) => cb(ids ? books.filter((book) => ids.includes(book['id'])) : []))
  }

  postUser(user: User) {
    this.users.push(user)
  }

  postBook(book: Book) {
    this.books.push(book)
  }

  postBookForUser(userRef: string, book: User.Book) {
    this.userBooksRef(userRef).push(book)
  }

  getBooksForUser(userRef: string, cb) {
    // Join books and user books
    this.userBooksRef(userRef).valueChanges().subscribe((userBooks) => {
      // Map array to object where keys are the book ids and values are the books
      const mappedBooks = userBooks.reduce((obj, book) => (obj[book['id']] = book, obj), {})

      this.getBooksByIds(Object.keys(mappedBooks), (books) => {
        const mergedBooks = books.map((book) => ({ ...(book), ...(mappedBooks[book['id']]) }))
        console.log(mergedBooks)
        cb(mergedBooks)
      })
    })
  }

  getCollectionsForUser(userRef: string, cb) {
    this.userCollectionsRef(userRef).valueChanges().subscribe((userCollections) => {
      console.log(userCollections)
      this.getBooksByIds(userCollections['books'], (books) => {
        userCollections['books'] = books
        console.log(userCollections)
        cb(userCollections)
      })
    })
  }
}
