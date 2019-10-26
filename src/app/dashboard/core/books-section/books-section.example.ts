import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { GridComponent } from '../grid/grid.component'
import { BookCardComponent } from '../book-card/book-card.component'
import { BooksSectionComponent } from './books-section.component'
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
import BookFactory from 'factories/book.factory'

const books = BookFactory.buildList(5, {
  canBeSelected: true,
  isSelected: true,
})
const bookInLibrary = BookFactory.build({
  canBeSelected: false,
  isSelected: false,
})

storiesOf('Books Section', module)
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
      declarations: [GridComponent, BookCardComponent, BooksSectionComponent],
    })
  )
  .add('default', () => ({
    component: BooksSectionComponent,
    props: {
      books,
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true,
    },
  }))
  .add('selectable', () => ({
    component: BooksSectionComponent,
    props: {
      books: [...books, bookInLibrary],
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true,
      selectable: true,
      selectBtnContent: 'Add to library',
      selectBtnContentDisabled: 'Already in library',
    },
  }))
  .add('clickable', () => ({
    component: BooksSectionComponent,
    props: {
      books,
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true,
      clickable: true,
    },
  }))
