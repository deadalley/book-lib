import { TestBed, inject } from '@angular/core/testing'
import { APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { environment } from 'environments/environment'
import { AppRoutes } from '../app/app.routing'
import { Subject } from 'rxjs/Subject'
import { takeUntil } from 'rxjs/operators'

import { AuthService } from './auth.service'
import { SessionService } from './session.service'
import { DatabaseService } from './database.service'
import { LibraryService } from './library.service'

import { Book } from '../database/models/book.model'
import { Collection } from '../database/models/collection.model'

import UserFactory from '../database/factories/user.factory'
import BookFactory from '../database/factories/book.factory'
import CollectionFactory from '../database/factories/collection.factory'
import { Subscription, of } from 'rxjs'
import { getUrlScheme } from '@angular/compiler'

fdescribe('LibraryService', () => {
  let library: LibraryService
  let database: DatabaseService
  let auth: AuthService

  let subscriptions: Subscription[] = []

  const push = (subscription: Subscription) => {
    subscriptions.push(subscription)
  }

  const flush = () => {
    console.log('Flushing')
    subscriptions.forEach(subscription => subscription.unsubscribe())
  }

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

  afterEach(() => {
    flush()
  })

  afterAll(() => {
    database.cleanTestBed()
    auth.logout()
    localStorage.clear()
  })

  let user = UserFactory.build()
  let book = BookFactory.build()
  let collection = CollectionFactory.build()

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
    beforeEach(async () => {
      user = await database.createUser(user)
      book = await database.createBookForUser(user.id, book)
      collection = await database.createCollectionForUser(user.id, collection)
      library.userRef = user.id
      library.loadLibrary()
    })

    it('loads books', done => {
      push(
        library.books$.subscribe(books => {
          expect(books).toBeDefined()
          expect(books.length).toEqual(1)
          done()
        })
      )
    })

    it('loads collections', done => {
      push(
        library.collections$.subscribe(collections => {
          expect(collections).toBeDefined()
          expect(collections.length).toEqual(1)
          done()
        })
      )
    })
  })
})
