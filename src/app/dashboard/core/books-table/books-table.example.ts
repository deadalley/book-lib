import { APP_BASE_HREF, CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { moduleMetadata } from '@storybook/angular'
import { BooksTableComponent } from './books-table.component'
import { BookButtonComponent } from '../book-button/book-button.component'
import BookFactory from 'factories/book.factory'
import { LibraryService } from 'services/library.service'
import { GoodreadsService } from '../../../../services/goodreads.service'
import { DatabaseService } from 'services/database.service'
import { SessionService } from 'services/session.service'
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

const books = BookFactory.buildList(5, {
  canBeSelected: true,
  isSelected: true,
  read: false,
  wishlist: true,
  owned: false,
  favorite: true,
})
const bookInLibrary = BookFactory.build({
  canBeSelected: false,
  isSelected: false,
})

const tableItems = {
  Cover: false,
  'Original title': false,
  Author: true,
  'Added on': false,
  Year: false,
  Publisher: false,
  Language: false,
  Pages: false,
  Rating: false,
  Favorites: true,
}

const allTableItems = {
  Cover: true,
  'Original title': true,
  Author: true,
  'Added on': true,
  Year: true,
  Publisher: true,
  Language: true,
  Pages: true,
  Rating: true,
  Favorites: true,
}

export default {
  title: 'Books Table',
  component: BooksTableComponent,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        DatabaseService,
        GoodreadsService,
        LibraryService,
        SessionService,
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
      declarations: [BookButtonComponent, BooksTableComponent],
    }),
  ],
}

export const Default = () => ({
  component: BooksTableComponent,
  props: {
    books,
    withButtons: true,
    displayItems: tableItems,
  },
})

export const Selectable = () => ({
  books: [...books, bookInLibrary, ...books],
  withButtons: true,
  selectable: true,
  statusIncluded: 'In library',
  statusNotIncluded: 'Not in library',
  statusCannotBeSelected: 'Already in library',
  displayItems: tableItems,
})

export const Clickable = () => ({
  component: BooksTableComponent,
  props: {
    books,
    withButtons: true,
    clickable: true,
    displayItems: tableItems,
  },
})

export const WithAllItems = () => ({
  component: BooksTableComponent,
  props: {
    books,
    withButtons: true,
    displayItems: allTableItems,
  },
})
