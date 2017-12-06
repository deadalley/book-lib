import { Injectable } from '@angular/core';
import { Book } from '../book';
//import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {
  usersRef = firebase.database().ref('users')
  booksRef = firebase.database().ref('books')

  get user_id() {
    let user = localStorage.getItem('user_google')
    user = JSON.parse(user).uid;
    return user
  }

  constructor(/*private db: AngularFireDatabase*/) { }

  hasBooks(callback) {
    this.usersRef.child(this.user_id).once('value', snapshot => {
      callback(snapshot.hasChild('books'))
    })
  }

  addBook(book) {
    let newBookKey = this.booksRef.push().key;

    let updates = {}
    updates['/books/' + newBookKey] = book
    //book.date = 'aa'
    updates['/users/' + this.user_id + '/books/' + newBookKey] = book
    //updates['/users/' + this.user_id + '/books/' + newBookKey + '/date'] = new Date().toISOString().slice(0, 10)

    /*let newBookKey = this.usersRef.child(this.user_id).child('books').push().key

    let updates = {}
    updates['/books/' + newBookKey] = book
    updates['/users/' + this.user_id + '/books/' + newBookKey] = book
*/
    firebase.database().ref().update(updates, (err) => {
      if (err)
        alert('Could not add book to Firebase.')
    })
  }

  getLatestBooks(latestBooks) {
    let _books = this.usersRef.child(this.user_id).child('books').limitToLast(10);

    _books.on('value', (snapshot) => {
      console.log(snapshot.val())
      latestBooks = snapshot.val();
    })
    /*let book = {} as Book
    book.title = 'Harry Potter 1'
    book.author = 'JK Rowling'
    book.image_large = '/assets/img/hp01.jpeg'
    latestBooks.push(book)
    book.title = 'Harry Potter 2'
    book.image_large = '/assets/img/hp02.jpeg'
    latestBooks.push(book)*/
    //this.usersRef.child(this.user_id)
  }

  getBooks(books) {
    let _books = this.usersRef.child(this.user_id).child('books');

    _books.once('value', (snapshot) => {
      if (books) return;
      console.log(snapshot.val())
      /*snapshot.val().forEach(key => {
        books.push(snapshot.val()[key]);
      })*/
      //books = snapshot.val;
    })

    _books.on('child_added', (snapshot) => {
      /*snapshot.val().forEach(key => {
        books.push(snapshot.val()[key]);
      })*/
    })
  }

}
