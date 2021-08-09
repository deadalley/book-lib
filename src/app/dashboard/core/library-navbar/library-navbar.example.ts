import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { moduleMetadata } from '@storybook/angular'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { AppRoutes } from '../../../app.routing'
import { LibraryService } from 'services/library.service'
import { GoodreadsService } from 'services/goodreads.service'
import { DatabaseService } from 'services/database.service'
import { SessionService } from 'services/session.service'
import { UiService } from 'services/ui.service'
import { AngularFireModule } from 'angularfire2'
import {
  AngularFireDatabase,
  AngularFireDatabaseModule,
} from 'angularfire2/database'
import { environment } from 'environments/environment'
import {
  AngularFireStorage,
  AngularFireStorageModule,
} from 'angularfire2/storage'
import { LibraryNavbarComponent } from './library-navbar.component'
import {
  FILTERS,
  BOOK_GROUPINGS,
  COLLECTION_GROUPINGS,
} from 'utils/constants'

export default {
  title: 'Library Navbar',
  component: LibraryNavbarComponent,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        DatabaseService,
        GoodreadsService,
        LibraryService,
        SessionService,
        UiService,
        AngularFireDatabase,
        AngularFireStorage,
      ],
      imports: [
        HttpClientModule,
        CommonModule,
        RouterModule.forRoot(AppRoutes),
        TooltipModule.forRoot(),
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        BrowserAnimationsModule,
      ],
      declarations: [LibraryNavbarComponent],
    })
  ]
}

export const Books = () => ({
  component: LibraryNavbarComponent,
  props: {
    groupings: BOOK_GROUPINGS,
    filters: FILTERS,
    addButtonContent: 'Add a new book',
  }
})

export const Collections = () => ({
  component: LibraryNavbarComponent,
  props: {
    groupings: COLLECTION_GROUPINGS,
    addButtonContent: 'Add a new collection',
  },
})
