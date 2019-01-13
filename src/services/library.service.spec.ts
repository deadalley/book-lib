import { TestBed, inject } from '@angular/core/testing'
import { APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { environment } from 'environments/environment'
import { AppRoutes } from '../app/app.routing'

import { AuthService } from './auth.service'
import { SessionService } from './session.service'
import { DatabaseService } from './database.service'
import { LibraryService } from './library.service'

import { Book } from '../database/models/book.model'
import { Collection } from '../database/models/collection.model'

import UserFactory from '../database/factories/user.factory'
import BookFactory from '../database/factories/book.factory'
import CollectionFactory from '../database/factories/collection.factory'

describe('LibraryService', () => {
  let library: LibraryService
  let database: DatabaseService
  let auth: AuthService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthService,
        SessionService,
        DatabaseService,
        LibraryService,
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
    library = TestBed.get(LibraryService)
    await auth.loginEmail(environment.testConfig)
  })

  afterAll(() => {
    database.cleanTestBed()
    auth.logout()
    localStorage.clear()
  })

  const user = UserFactory.build()
  const book = BookFactory.build()
  const collection = CollectionFactory.build()

  const createBook = (ownerId, { collections = [] } = {}) => {
    const newBook = BookFactory.build({
      ownerId,
      collections,
    })
    return database.createBookForUser(ownerId, newBook)
  }

  const createCollection = (ownerId, { books = [] } = {}) => {
    const newCollection = CollectionFactory.build({
      ownerId,
      books,
    })
    return database.createCollectionForUser(ownerId, newCollection)
  }

  const createBooksForUser = ownerId => {
    const newBook = BookFactory.build()
    return Promise.all([
      database.createBookForUser(ownerId, newBook),
      database.createBookForUser(ownerId, newBook),
      database.createBookForUser(ownerId, newBook),
    ])
  }

  it('should be created', inject(
    [DatabaseService],
    (service: DatabaseService) => {
      expect(service).toBeTruthy()
    }
  ))

  describe('Library', () => {
    beforeEach(() => {
      library.loadLibrary()
    })

    it('triggers observable when book added', done => {
      library.books$.subscribe(books => {
        expect(books).toBeDefined()
        expect(books.length).toEqual(1)
        done()
      })
    })
  })

  xdescribe('Book', () => {
    xit('adds a book for a user', () => {
      const newBook = BookFactory.build({ collections: [collection.title] })
      library.addBook(newBook)
    })
  })
})
