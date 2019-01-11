import { TestBed, inject } from '@angular/core/testing'
import { APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AngularFireModule } from 'angularfire2'
import {
  AngularFireDatabaseModule,
  AngularFireDatabase,
} from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { environment } from 'environments/environment'
import { assertThat, equalTo } from 'hamjest'
import { AppRoutes } from '../app/app.routing'

import { AuthService } from './auth.service'
import { SessionService } from './session.service'
import { DatabaseService } from './database.service'

import { User } from '../database/models/user.model'
import { Book } from '../database/models/book.model'
import { Collection } from '../database/models/collection.model'

import UserFactory from '../database/factories/user.factory'
import BookFactory from '../database/factories/book.factory'
import CollectionFactory from '../database/factories/collection.factory'

describe('DatabaseService', () => {
  let database: DatabaseService
  let auth: AuthService
  let session: SessionService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthService,
        SessionService,
        DatabaseService,
      ],
      imports: [
        RouterModule.forRoot(AppRoutes),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
      ],
    })

    database = TestBed.get(DatabaseService)
    auth = TestBed.get(AuthService)
    session = TestBed.get(SessionService)
    await auth.loginEmail(environment.testConfig)
  })

  afterEach(() => {
    // database.cleanTestBed()
    auth.logout()
    localStorage.clear()
  })

  it('should be created', inject(
    [DatabaseService],
    (service: DatabaseService) => {
      expect(service).toBeTruthy()
    }
  ))

  describe('User', () => {
    let user = UserFactory.build()

    beforeEach(async () => {
      user = await database.createUser(user)
    })

    it('creates a user', done => {
      database.createUser(user)

      database.users.valueChanges().subscribe(value => {
        const lastIndex = value.length - 1
        expect(value[lastIndex].name).toEqual(user.name)
        expect(value[lastIndex].email).toEqual(user.email)
        expect(value[lastIndex].uid).toEqual(user.uid)
        expect(value[lastIndex].goodreadsId).toEqual(user.goodreadsId)
        done()
      })
    })

    it('finds user by id', done => {
      database.findUserById(user.id).then(value => {
        expect(value.id).toEqual(user.id)
        expect(value.name).toEqual(user.name)
        expect(value.email).toEqual(user.email)
        done()
      })
    })

    it('finds user by name', done => {
      database.findUserByParam('name', user.name).then(value => {
        expect(value.name).toEqual(user.name)
        done()
      })
    })

    it('updates the user', done => {
      const updateParams = { name: 'A new name', email: 'email@test.com' }
      database.updateUser(user.id, updateParams).then(value => {
        expect(value.name).toEqual(updateParams.name)
        expect(value.email).toEqual(updateParams.email)
        done()
      })
    })
  })

  describe('Book', () => {
    let user = UserFactory.build()
    let book = BookFactory.build()
    let collection = CollectionFactory.build()

    beforeEach(async () => {
      user = await database.createUser(user)
      book = await database.createBookForUser(user.id, book)
      collection = await database.createCollectionForUser(user.id, collection)
    })

    it('creates a book for a user', done => {
      const newBook = BookFactory.build({
        ownerId: user.id,
        collections: [collection.id],
      })
      database.createBookForUser(user.id, newBook).then(value => {
        expect(value.title).toEqual(newBook.title)
        expect(value.ownerId).toEqual(newBook.ownerId)
        expect(value.collections).toContain(collection.id)

        database.findCollectionById(collection.id).then(collectionForBook => {
          expect(collectionForBook.books).toContain(value.id)
          done()
        })
      })
    })

    it('finds a book by id', done => {
      database.findBookById(book.id).then(value => {
        expect(value.id).toEqual(book.id)
        expect(value.title).toEqual(book.title)
        expect(value.ownerId).toEqual(book.ownerId)
        done()
      })
    })

    it('update book', done => {
      const updateParams = {
        title: 'A new title',
        publisher: 'Not a publisher',
        genres: [],
        language: '',
        collections: [collection.id],
      }

      database
        .updateBookForUser(user.id, { ...book, ...updateParams } as Book)
        .then(() => {
          Promise.all([
            database.findBookById(book.id).then(value => {
              expect(value.title).toEqual(updateParams.title)
              expect(value.publisher).toEqual(updateParams.publisher)
              expect(value.language).toEqual(updateParams.language)
              expect(value.genres).toEqual(updateParams.genres)
              expect(value.collections).toContain(collection.id)
            }),
            database
              .findCollectionById(collection.id)
              .then(value => {
                expect(value.books).toContain(book.id)
              })
              .then(() => done()),
          ])
        })
    })

    it('deletes a book for a user', done => {
      const newBook = BookFactory.build({ collections: [collection.id] })
      database.createBookForUser(user.id, newBook).then(bookDb => {
        database.deleteBook(user.id, bookDb as Book).then(() => {
          Promise.all([
            database.findBookById(bookDb.id).then(value => {
              expect(value).toBeNull()
            }),
            database.findCollectionById(collection.id).then(value => {
              expect(value.books).not.toContain(bookDb.id)
            }),
            database.findUserById(user.id).then(value => {
              expect(value.books).not.toContain(bookDb.id)
            }),
          ]).then(() => done())
        })
      })
    })
  })

  describe('Collection', () => {
    let user = UserFactory.build()
    let book = BookFactory.build()
    let collection = CollectionFactory.build()

    beforeEach(async () => {
      user = await database.createUser(user)
      book = await database.createBookForUser(user.id, book)
      collection = await database.createCollectionForUser(user.id, collection)
    })

    const addBooksToCollection = () => {
      const newBook = BookFactory.build()
      return Promise.all([
        database.createBookForUser(user.id, newBook),
        database.createBookForUser(user.id, newBook),
        database.createBookForUser(user.id, newBook),
      ]).then(books => {
        database.addBooksToCollection(collection.id, books)
        return books
      })
    }

    it('adds books to collection', done => {
      addBooksToCollection().then(books => {
        database.addBooksToCollection(collection.id, books).then(() => {
          database.findCollectionById(collection.id).then(value => {
            expect(value.books).toContain(books[0].id)
            expect(value.books).toContain(books[1].id)
            expect(value.books).toContain(books[2].id)
            done()
          })
        })
      })
    })

    fit('removes books from a collection', done => {
      addBooksToCollection().then(books => {
        database
          .removeBooksFromCollection(collection.id, [books[0], books[1]])
          .then(() => {
            database.findCollectionById(collection.id).then(value => {
              expect(value.books).not.toContain(books[0].id)
              expect(value.books).not.toContain(books[1].id)
              expect(value.books).toContain(books[2].id)
              done()
            })
          })
      })
    })

    // it('creates a collection for a user', done => {
    //   const newBook = BookFactory.build({
    //     ownerId: user.id,
    //     collections: [collection.id],
    //   })
    //   database.createBookForUser(user.id, newBook).then(value => {
    //     expect(value.title).toEqual(newBook.title)
    //     expect(value.ownerId).toEqual(newBook.ownerId)
    //     expect(value.collections).toContain(collection.id)

    //     database.findCollectionById(collection.id).then(collectionForBook => {
    //       expect(collectionForBook.books).toContain(value.id)
    //       done()
    //     })
    //   })
    // })
  })
})
