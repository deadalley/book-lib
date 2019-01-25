import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { BooksTableComponent } from './books-table.component'
import BookFactory from 'factories/book.factory'
import { LibraryService } from 'services/library.service'
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

const books = BookFactory.buildList(5, {
  canBeSelected: true,
  isSelected: true,
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

storiesOf('Books Table', module)
  .addDecorator(
    moduleMetadata({
      providers: [
        DatabaseService,
        LibraryService,
        SessionService,
        AngularFireDatabase,
        AngularFireStorage,
      ],
      imports: [
        CommonModule,
        RouterModule,
        TooltipModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        BrowserAnimationsModule,
      ],
    })
  )
  .add('default', () => ({
    component: BooksTableComponent,
    props: {
      books,
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true,
      displayItems: tableItems,
    },
  }))
  .add('selectable', () => ({
    component: BooksTableComponent,
    props: {
      books: [...books, bookInLibrary, ...books],
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true,
      selectable: true,
      statusIncluded: 'In library',
      statusNotIncluded: 'Not in library',
      statusCannotBeSelected: 'Already in library',
      displayItems: tableItems,
    },
  }))
  .add('clickable', () => ({
    component: BooksTableComponent,
    props: {
      books,
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true,
      clickable: true,
      displayItems: tableItems,
    },
  }))
