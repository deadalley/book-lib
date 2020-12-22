import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { moduleMetadata } from '@storybook/angular'
import BookFactory from 'factories/book.factory'
import { BookButtonComponent } from '../book-button/book-button.component'
import { BookCardComponent } from './book-card.component'
import { LibraryService } from 'services/library.service'
import { DatabaseService } from 'services/database.service'
import { SessionService } from 'services/session.service'
import { GoodreadsService } from 'services/goodreads.service'
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
import { AppRoutes } from '../../../app.routing'

const book = BookFactory.build({
  canBeSelected: true,
  read: true,
  wishlist: false,
})
const bookCannotBeSelected = BookFactory.build({ canBeSelected: false })

export default {
  title: 'Book Card',
  component: BookCardComponent,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        DatabaseService,
        LibraryService,
        SessionService,
        GoodreadsService,
        AngularFireDatabase,
        AngularFireStorage,
      ],
      imports: [
        HttpClientModule,
        CommonModule,
        RouterModule.forRoot(AppRoutes),
        TooltipModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        BrowserAnimationsModule,
      ],
      declarations: [BookButtonComponent, BookCardComponent],
    }),
  ],
}

export const Default = () => ({
  component: BookCardComponent,
  props: {
    book,
  },
})

export const WithButtons = () => ({
  component: BookCardComponent,
  props: {
    book,
    withButtons: true,
  },
})

export const Clickable = () => ({
  component: BookCardComponent,
  props: {
    book,
    clickable: true,
  },
})

export const Selectable = () => ({
  component: BookCardComponent,
  props: {
    book,
    selectable: true,
  },
})

export const Selected = () => ({
  component: BookCardComponent,
  props: {
    book: { ...book, isSelected: true },
    selectable: true,
  },
})

export const SelectableAndCannotBeSelected = () => ({
  component: BookCardComponent,
  props: {
    book: bookCannotBeSelected,
    selectable: true,
  },
})
