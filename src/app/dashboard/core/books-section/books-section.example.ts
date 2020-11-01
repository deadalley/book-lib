import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { moduleMetadata } from '@storybook/angular'
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
import { GridComponent } from '../grid/grid.component'
import { BookCardComponent } from '../book-card/book-card.component'
import { BooksSectionComponent } from './books-section.component'
import { LibraryService } from 'services/library.service'
import { DatabaseService } from 'services/database.service'
import { SessionService } from 'services/session.service'
import { GoodreadsService } from 'services/goodreads.service'
import BookFactory from 'factories/book.factory'
import { AppRoutes } from '../../../app.routing'

const books = BookFactory.buildList(5, {
  canBeSelected: true,
  isSelected: true,
})

export default {
  title: 'Books Section',
  component: BooksSectionComponent,
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
      declarations: [GridComponent, BookCardComponent],
    }),
  ],
}

export const Default = () => ({
  component: BooksSectionComponent,
  props: {
    books,
    sectionTitle: 'Section Name',
    description: 'A description',
    withButtons: true,
  },
})

export const Clickable = () => ({
  component: BooksSectionComponent,
  props: {
    books,
    sectionTitle: 'Section Name',
    description: 'A description',
    withButtons: true,
    clickable: true,
  },
})

export const Selectable = () => ({
  component: BooksSectionComponent,
  props: {
    books,
    sectionTitle: 'Section Name',
    description: 'A description',
    withButtons: true,
    selectable: true,
  },
})
