import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { User } from '../database/models/user.model'
import { Book } from '../database/models/book.model'
import { Collection } from '../database/models/collection.model'
import {
  objectToArray,
  objectToArrayWithRef,
  filterByParam,
  findKeyByValue,
  unique,
} from '../utils/helpers'
import { environment } from 'environments/environment'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/takeUntil'

@Injectable()
export class DatabaseService {
  users: AngularFireList<User>
  books: AngularFireList<Book>
  collections: AngularFireList<Collection>
  isLoggedIn$ = new Subject<boolean>()
  rootUrl = environment.name === 'development' ? 'test' : ''

  private userBooksRef(userRef: string): AngularFireList<string> {
    return this.db.list(`${this.rootUrl}/users/${userRef}/books`)
  }

  private userCollectionsRef(userRef: string): AngularFireList<string> {
    return this.db.list(`${this.rootUrl}/users/${userRef}/collections`)
  }

  constructor(private db: AngularFireDatabase) {
    this.books = db.list(`${this.rootUrl}/books`)
    this.users = db.list(`${this.rootUrl}/users`)
    this.collections = db.list(`${this.rootUrl}/collections`)
  }

  cleanTestBed() {
    console.log('Cleaning test bed')
    if (environment.name !== 'development') {
      return
    }

    this.books.remove()
    this.users.remove()
    this.collections.remove()
  }

  private findById(
    id: string,
    model: AngularFireList<any>,
    parseFn: (object, id) => {}
  ) {
    console.log('id', id)
    return model.query
      .orderByKey()
      .equalTo(id)
      .once('value')
      .then(snap =>
        snap.val()
          ? parseFn(
              snap.val()[Object.keys(snap.val())[0]],
              Object.keys(snap.val())[0]
            )
          : null
      )
  }

  private findByParam(
    key: string,
    value: string,
    model: AngularFireList<any>,
    parseFn: (object, id) => {}
  ) {
    return model.query
      .orderByChild(key)
      .equalTo(value)
      .once('value')
      .then(snap =>
        snap.val()
          ? parseFn(
              snap.val()[Object.keys(snap.val())[0]],
              Object.keys(snap.val())[0]
            )
          : null
      )
  }

  /** USER **/
  private parseUser(user: User, id: string) {
    return {
      ...user,
      id,
      books: objectToArray(user.books) || [],
      collections: objectToArray(user.collections) || [],
    }
  }

  createUser(user: User) {
    return this.users.push(user).then(res => this.parseUser(user, res.ref.key))
  }

  findUserById(id: string) {
    return this.users.query
      .orderByKey()
      .equalTo(id)
      .once('value')
      .then(snap =>
        this.parseUser(
          snap.val()[Object.keys(snap.val())[0]],
          Object.keys(snap.val())[0]
        )
      )
  }

  findUserByParam(key: string, value: string) {
    return this.users.query
      .orderByChild(key)
      .equalTo(value)
      .once('value')
      .then(snap =>
        snap.val()
          ? this.parseUser(
              snap.val()[Object.keys(snap.val())[0]],
              Object.keys(snap.val())[0]
            )
          : null
      )
  }

  updateUser(id: string, params: object) {
    this.users.update(id, params as User)
    return this.findUserById(id)
  }

  /** BOOK **/
  private parseBook(book: Book, id: string) {
    return {
      ...book,
      id,
      genres: book.genres || [],
      collections: book.collections || [],
      tags: book.tags || [],
    }
  }

  private createBook(book: Book) {
    return this.books.push(book).then(res => this.parseBook(book, res.ref.key))
  }

  findBookById(id: string) {
    return this.findById(id, this.books, this.parseBook).then(
      book => book as Book
    )
  }

  postBooksForCollections(books) {
    this.collections.query.orderByChild('id').once('value', snap => {
      const allCollections = objectToArrayWithRef(snap.val())
      books.forEach(book => {
        const collections = filterByParam(
          allCollections,
          book.collections,
          'id'
        )
        collections.forEach(collection =>
          this.db
            .list(`${this.rootUrl}/collections/${collection.ref}/books`)
            .push(book.id)
        )
      })
    })
  }

  createBookForUser(userRef: string, book) {
    return this.createBook({ ...book, ownerId: userRef }).then(
      bookInDatabase => {
        this.userBooksRef(userRef).push(bookInDatabase.id)

        if (book.collections) {
          return Promise.all(
            book.collections.map(collectionId => {
              return this.addBooksToCollection(collectionId, [bookInDatabase])
            })
          ).then(() => bookInDatabase)
        }

        return bookInDatabase
      }
    )
  }

  // findBookForUserById(userRef: string, id: string, cb) {
  //   this.getBooksForUser(userRef, books => cb(books[0]), [id])
  // }

  private getBooksByParam(key: string, value: string) {
    return this.books.query
      .orderByChild(key)
      .equalTo(value)
      .once('value')
      .then(snap =>
        snap.val()
          ? Object.keys(snap.val()).map(_key =>
              this.parseBook(snap.val()[_key], _key)
            )
          : []
      )
  }

  getBooksForCollection(id: string, userRef: string) {
    return this.getBooksForUser(userRef).then(books =>
      books.filter(book => book.collections.includes(id))
    )
  }

  private getBooksByIds(cb, ids?: string[]) {
    return this.books.query
      .once('value')
      .then(snap => filterByParam(objectToArray(snap.val()), ids, 'id'))
  }

  private getBooksForUserByIds(userRef: string, cb, ids?: string[]) {
    return this.userBooksRef(userRef)
      .valueChanges()
      .takeUntil(this.isLoggedIn$)
      .map(books => filterByParam(books, ids, 'id'))
  }

  getBooksForUser(userRef: string, cb?, bookIds?: string[]) {
    return this.getBooksByParam('ownerId', userRef)
    // Join books and user books
    // this.getBooksForUserByIds(userRef, null).subscribe(async userBooks => {
    //   const books = await this.getBooksByParam('ownerId', userRef)
    //   // const books = await this.getBooksByIds(
    //   //   null,
    //   //   userBooks.map(book => book.id)
    //   // )

    //   // const mappedBooks = arrayToObjectWithId(userBooks)
    //   // const mergedBooks = books.map(book => ({
    //   //   ...book,
    //   //   ...mappedBooks[book.id],
    //   // }))

    //   // const collectionIds = mergedBooks
    //   //   .map(book => book.collections)
    //   //   .filter(c => c)
    //   // if (collectionIds.length) {
    //   //   const collections = await this.getCollectionsByIds(null, collectionIds)
    //   //   mergedBooks.forEach(book => {
    //   //     if (!book.collections) {
    //   //       return
    //   //     }
    //   //     book.collections = filterByParam(
    //   //       collections,
    //   //       book.collections,
    //   //       'id'
    //   //     ).map(collection => collection.title)
    //   //   })
    //   // }
    //   cb(books)
    // })
  }

  private updateBook(book) {
    this.books.query
      .orderByChild('id')
      .equalTo(book.id)
      .once('value', snap => {
        const ref = Object.keys(snap.val())[0]
        this.db.object(`books/${ref}`).set(book)
      })
  }

  private updateBookCollections(
    book: Book,
    oldCollections: string[] = [],
    newCollections: string[] = []
  ) {
    // if (!newCollections) {
    //   newCollections = []
    // }
    // if (!oldCollections) {
    //   oldCollections = []
    // }

    const collectionsToAdd = newCollections.filter(
      collection => !oldCollections.includes(collection)
    )
    const collectionsToRemove = oldCollections.filter(
      collection => !newCollections.includes(collection)
    )

    // if (collectionsToAdd.length > 0) {
    collectionsToAdd.forEach(collectionId =>
      this.addBooksToCollection(collectionId, [book])
    )
    // }
    collectionsToRemove.forEach(collectionId =>
      this.removeBooksFromCollection(collectionId, [book])
    )

    // if (collectionsToRemove.length > 0) {
    //   this.deleteBooksFromCollection([
    //     { id: bookId, collections: collectionsToRemove },
    //   ])
    // }
  }

  updateBookForUser(userRef: string, book: Book) {
    return this.findBookById(book.id).then(oldBook => {
      // this.books.update(book.id, { ...oldBook, ...book })

      const oldCollections = oldBook.collections || []
      const newCollections = book.collections || []

      const collectionsToAdd = newCollections.filter(
        collection => !oldCollections.includes(collection)
      )
      const collectionsToRemove = oldCollections.filter(
        collection => !newCollections.includes(collection)
      )

      return Promise.all([
        this.books.update(book.id, { ...oldBook, ...book }),
        ...collectionsToAdd.map(collectionId =>
          this.addBooksToCollection(collectionId, [book])
        ),
        ...collectionsToRemove.map(collectionId =>
          this.removeBooksFromCollection(collectionId, [book])
        ),
      ])
      // collectionsToAdd.forEach(collectionId =>
      //   this.addBooksToCollection(collectionId, [book])
      // )
      // collectionsToRemove.forEach(collectionId =>
      //   this.removeBooksFromCollection(collectionId, [book])
      // )
    })
    // this.userBooksRef(userRef)
    //   .query.orderByChild('id')
    //   .equalTo(book.id)
    //   .once('value', snap => {
    //     const ref = Object.keys(snap.val())[0]
    //     const oldCollectionsState = objectToArray(snap.val()[ref].collections)
    //     const newCollectionsState = book.collections

    //     if (!book.collections) {
    //       book.collections = ['placeholder']
    //     }
    //     this.db
    //       .object(`users/${userRef}/books/${ref}`)
    //       .set(filterBookForUser(book))

    //     if (newCollectionsState && newCollectionsState.length > 0) {
    //       this.db
    //         .object(`users/${userRef}/books/${ref}/collections`)
    //         .set(newCollectionsState)
    //     } else {
    //       this.db.object(`users/${userRef}/books/${ref}/collections`).remove()
    //     }

    //     this.updateBookCollections(
    //       book.id,
    //       oldCollectionsState,
    //       newCollectionsState
    //     )
    //   })
    // this.updateBook(filterBook(book))
  }

  deleteBooksFromCollection(books) {
    // this.collections.query.orderByChild('id').once('value', snap => {
    //   const allCollections = objectToArrayWithRef(snap.val())
    //   books.forEach(book => {
    //     const collections = filterByParam(
    //       allCollections,
    //       book.collections,
    //       'id'
    //     )
    //     collections.forEach(collection => {
    //       this.db
    //         .list(`collections/${collection.ref}/books`)
    //         .query.orderByValue()
    //         .equalTo(book.id)
    //         .once('value', _snap => {
    //           if (!_snap.val()) {
    //             return
    //           }
    //           const ref = Object.keys(_snap.val())[0]
    //           this.db
    //             .list(`collections/${collection.ref}/books/${ref}`)
    //             .remove()
    //         })
    //     })
    //   })
    // })
  }

  deleteBook(userRef: string, book: Book) {
    console.log(userRef, book)
    return Promise.all([
      this.books.remove(book.id),
      this.userBooksRef(userRef)
        .query.once('value')
        .then(bookIds => {
          const bookRef = findKeyByValue(bookIds, book.id)
          return this.userBooksRef(userRef).remove(bookRef)
        }),
      ...book.collections.map(collectionId => {
        this.removeBooksFromCollection(collectionId, [book])
      }),
    ])
    // this.books.query
    //   .orderByChild('id')
    //   .equalTo(book.id)
    //   .once('value', snap => {
    //     if (!snap.val()) {
    //       return
    //     }
    //     const ref = Object.keys(snap.val())[0]

    //     this.db.object(`books/${ref}`).remove()
    //   })

    // this.userBooksRef(userRef)
    //   .query.orderByChild('id')
    //   .equalTo(book.id)
    //   .once('value', snap => {
    //     if (!snap.val()) {
    //       return
    //     }
    //     const ref = Object.keys(snap.val())[0]

    //     this.db.object(`users/${userRef}/books/${ref}`).remove()
    //   })

    // if (book.collections) {
    //   this.deleteBooksFromCollection([book])
    // }
  }

  /** COLLECTION **/
  private parseCollection(collection: Collection, id: string) {
    return {
      ...collection,
      id,
      books: collection.books || [],
    }
  }

  private createCollection(collection: Collection) {
    return this.collections
      .push(collection)
      .then(res => this.parseCollection(collection, res.ref.key))
  }

  private getCollectionsByParam(key: string, value: string) {
    return this.collections.query
      .orderByChild(key)
      .equalTo(value)
      .once('value')
      .then(snap =>
        snap.val()
          ? Object.keys(snap.val()).map(_key =>
              this.parseCollection(snap.val()[_key], _key)
            )
          : []
      )
  }

  findCollectionById(id: string) {
    return this.collections.query
      .orderByKey()
      .equalTo(id)
      .once('value')
      .then(snap =>
        this.parseCollection(
          snap.val()[Object.keys(snap.val())[0]],
          Object.keys(snap.val())[0]
        )
      )
  }

  createCollectionForUser(userRef: string, collection) {
    return this.createCollection({ ...collection, ownerId: userRef }).then(
      collectionInDatabase => {
        this.userCollectionsRef(userRef).push(collectionInDatabase.id)
        collectionInDatabase.books.forEach(bookId => {
          this.findBookById(bookId).then(book => {
            this.db
              .list(`${this.rootUrl}/books/${bookId}`)
              .set('collections', [
                ...book.collections,
                collectionInDatabase.id,
              ])
          })
        })
        return collectionInDatabase
      }
    )
    // this.db.object(`users/${userRef}`).query.once('value', snap => {
    //   const id = snap.val().id
    //   collection['owner'] = id
    //   this.userCollectionsRef(userRef).push(collection['id'])
    //   this.createCollection(collection)
    // })
    // return collection.id
  }

  getCollectionsForUser(userRef: string) {
    return this.getCollectionsByParam('ownerId', userRef)
  }

  addBooksToCollection(id: string, books: Book[]) {
    return this.findCollectionById(id).then(collection => {
      const booksForCollection = [...books.map(b => b.id), ...collection.books]
      return this.collections.update(id, {
        books: unique(booksForCollection),
      } as Collection)
    })
  }

  removeBooksFromCollection(id: string, books: Book[]) {
    return this.findCollectionById(id).then(collection => {
      const bookIds = books.map(book => book.id)
      const booksForCollection = collection.books.filter(
        bookId => !bookIds.includes(bookId)
      )
      console.log(books, bookIds, collection, booksForCollection)
      return this.collections.update(id, {
        books: booksForCollection,
      } as Collection)
    })
  }

  addCollectionsToBook(id: string, collections: Collection[]) {
    return this.findBookById(id).then(book => {
      const collectionsForBook = [
        ...collections.map(c => c.id),
        ...book.collections,
      ]
      return this.books.update(id, {
        collections: unique(collectionsForBook),
      } as Book)
    })
  }

  removeCollectionsFromBook(id: string, collections: Collection[]) {
    return this.findBookById(id).then(book => {
      const collectionIds = collections.map(collection => collection.id)
      const collectionsForBook = book.collections.filter(
        collectionId => !collectionIds.includes(collectionId)
      )
      return this.books.update(id, {
        collections: collectionsForBook,
      } as Book)
    })
  }

  postCollectionForBooks(
    userRef: string,
    collectionId: string,
    bookIds: string
  ) {
    this.userBooksRef(userRef)
      .query.orderByKey()
      .once('value', snap => {
        const books = objectToArrayWithRef(snap.val())
        books
          .filter(book => bookIds.includes(book.id))
          .forEach(book =>
            this.db
              .list(
                `${this.rootUrl}/users/${userRef}/books/${book.ref}/collections`
              )
              .push(collectionId)
          )
      })
  }

  // findCollectionById(id: string, cb) {
  //   this.getCollectionsByIds(collections => cb(collections[0]), [id])
  // }

  getCollectionsByIds(cb, ids?: string[]) {
    return this.collections.query
      .once('value')
      .then(snap => objectToArray(snap.val()))
    // this.collections.valueChanges().takeUntil(this.isLoggedIn$).subscribe((collections) => {
    //   cb(filterByParam(collections, ids, 'id'))
    // })
  }

  // getCollectionsForUser(userRef: string, collectionIds?: string[]) {
  //   return this.getCollectionsByParam('ownerId', userRef).then(collections => {
  //     return collections.map(collection => ({ ...collection, books: [] }))
  //   })
  //   // Map collections and books for user
  //   // const userCollections = this.userCollectionsRef(userRef).valueChanges().takeUntil(this.isLoggedIn$)
  //   // const userBooks = this.getBooksForUser(userRef)

  //   // forkJoin(userCollections, userBooks)
  //   this.userCollectionsRef(userRef)
  //     .valueChanges()
  //     .takeUntil(this.isLoggedIn$)
  //     .subscribe(userCollections => {
  //       this.getBooksForUser(userRef, books => {
  //         this.getCollectionsByIds(
  //           collections => {
  //             collections.forEach(collection => {
  //               if (!collection.books) {
  //                 collection.books = []
  //                 return
  //               }
  //               collection.books = objectToArray(collection.books)
  //               collection.books = filterByParam(books, collection.books, 'id')
  //             })
  //             cb(collections)
  //           },
  //           userCollections as string[]
  //         )
  //       })
  //     })
  // }

  private updateCollection(collection) {
    // this.collections.query
    //   .orderByChild('id')
    //   .equalTo(collection.id)
    //   .once('value', snap => {
    //     const ref = Object.keys(snap.val())[0]
    //     this.db.object(`collections/${ref}/title`).set(collection.title)
    //     this.db
    //       .object(`collections/${ref}/description`)
    //       .set(collection.description)
    //   })
  }

  updateCollectionForUser(userRef: string, collection: Collection) {
    this.findCollectionById(collection.id).then(oldCollection => {
      this.collections.update(collection.id, {
        ...oldCollection,
        ...collection,
      })

      const oldBooks = oldCollection.books || []
      const newBooks = collection.books || []

      const booksToAdd = newBooks.filter(book => !oldBooks.includes(book))
      const booksToRemove = oldBooks.filter(book => !newBooks.includes(book))

      booksToAdd.forEach(bookId =>
        this.addCollectionsToBook(bookId, [collection])
      )
      booksToRemove.forEach(bookId =>
        this.removeCollectionsFromBook(bookId, [collection])
      )
    })
  }

  deleteCollectionFromBooks(
    userRef: string,
    collectionId: string,
    bookIds: string[]
  ) {
    this.userBooksRef(userRef)
      .query.orderByKey()
      .once('value', snap => {
        const books = objectToArrayWithRef(snap.val())
        books
          .filter(book => bookIds.includes(book.id))
          .forEach(book => {
            this.db
              .list(
                `${this.rootUrl}/users/${userRef}/books/${book.ref}/collections`
              )
              .query.orderByValue()
              .equalTo(collectionId)
              .once('value', _snap => {
                if (!_snap.val()) {
                  return
                }
                const ref = Object.keys(_snap.val())[0]
                this.db
                  .object(
                    `users/${userRef}/books/${book.ref}/collections/${ref}`
                  )
                  .remove()
              })
          })
      })
  }

  deleteCollection(userRef: string, collection: Collection) {
    this.collections.remove(collection.id)

    this.userCollectionsRef(userRef)
      .query.once('value')
      .then(collectionIds => {
        const collectionRef = findKeyByValue(collectionIds, collection.id)
        this.userCollectionsRef(userRef).remove(collectionRef)
      })

    collection.books.forEach(bookId =>
      this.removeCollectionsFromBook(bookId, [collection])
    )
    // const collectionBooks = collection.books.map(book => book.id)
    // this.deleteCollectionFromBooks(userRef, collection.id, collectionBooks)

    // this.collections.query
    //   .orderByChild('id')
    //   .equalTo(collection.id)
    //   .once('value', snap => {
    //     if (!snap.val()) {
    //       return
    //     }
    //     const ref = Object.keys(snap.val())[0]

    //     this.db.object(`collections/${ref}`).remove()
    //   })

    // this.userCollectionsRef(userRef)
    //   .query.orderByValue()
    //   .equalTo(collection.id)
    //   .once('value', snap => {
    //     if (!snap.val()) {
    //       return
    //     }
    //     const ref = Object.keys(snap.val())[0]

    //     this.db.object(`users/${userRef}/collections/${ref}`).remove()
    //   })
  }
}
