import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import BookFactory from 'factories/book.factory'
import { BookCardComponent } from './book-card.component'
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

const book = BookFactory.build({ canBeSelected: true })
const bookCannotBeSelected = BookFactory.build({ canBeSelected: false })

storiesOf('Book Card', module)
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
      declarations: [BookCardComponent],
    })
  )
  .add('default', () => ({
    component: BookCardComponent,
    props: {
      book,
    },
  }))
  .add('with buttons', () => ({
    component: BookCardComponent,
    props: {
      book,
      withButtons: true,
    },
  }))
  .add('clickable', () => ({
    component: BookCardComponent,
    props: {
      book,
      clickable: true,
    },
  }))
  .add('selectable', () => ({
    component: BookCardComponent,
    props: {
      book,
      selectable: true,
      selectBtnContent: 'Add to library',
      selectBtnContentDisabled: 'Already in libray',
    },
  }))
  .add('selectable and book cannot be selected', () => ({
    component: BookCardComponent,
    props: {
      book: bookCannotBeSelected,
      selectable: true,
      selectBtnContent: 'Add to library',
      selectBtnContentDisabled: 'Already in libray',
    },
  }))
