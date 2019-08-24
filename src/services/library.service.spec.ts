import { TestBed, inject } from '@angular/core/testing'
import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireStorageModule } from 'angularfire2/storage'
import { environment } from 'environments/environment'
import { AppRoutes } from '../app/app.routing'

import { AuthService } from './auth.service'
import { AuthGuardService } from './auth.guard'
import { SessionService } from './session.service'
import { DatabaseService } from './database.service'
import { LibraryService } from './library.service'
import { GoodreadsService } from './goodreads.service'

import UserFactory from '../database/factories/user.factory'
import BookFactory from '../database/factories/book.factory'
import CollectionFactory from '../database/factories/collection.factory'
import { Subscription } from 'rxjs'

describe('LibraryService', () => {
  let library: LibraryService
  let database: DatabaseService
  let auth: AuthService
  let session: SessionService

  const subscriptions: Subscription[] = []

  const push = (subscription: Subscription) => {
    subscriptions.push(subscription)
  }

  const flush = () => {
    subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthService,
        AuthGuardService,
        SessionService,
        DatabaseService,
        LibraryService,
        GoodreadsService,
      ],
      imports: [
        RouterModule.forRoot(AppRoutes),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        HttpClientModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
      ],
    })

    database = TestBed.get(DatabaseService)
    auth = TestBed.get(AuthService)
    library = TestBed.get(LibraryService)
    session = TestBed.get(SessionService)
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
      session.localUser = user
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
