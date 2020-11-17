import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { moduleMetadata } from '@storybook/angular'
import { GridComponent } from '../grid/grid.component'
import { BookCardComponent } from '../book-card/book-card.component'
import { BooksSectionComponent } from '../books-section/books-section.component'
import { BooksTableComponent } from '../books-table/books-table.component'
import { BooksDisplayComponent } from './books-display.component'
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
import { UiService } from 'services/ui.service'
import { PagePipe } from 'pipes/page.pipe'
import { SearchFilterPipe } from 'pipes/search-filter.pipe'
import { BookFilterPipe } from 'pipes/book-filter.pipe'
import { PagesComponent } from '../pages/pages.component'
import { AppRoutes } from '../../../app.routing'
import { TableItemsComponent } from '../table-items/table-items.component'
import { ReactiveFormsModule } from '@angular/forms'

const books = BookFactory.buildList(13, {
  canBeSelected: true,
  isSelected: true,
})
const bookInLibrary = BookFactory.build({
  canBeSelected: false,
  isSelected: false,
})

export default {
  title: 'Books Display',
  component: BooksDisplayComponent,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        DatabaseService,
        LibraryService,
        SessionService,
        UiService,
        AngularFireDatabase,
        AngularFireStorage,
      ],
      imports: [
        CommonModule,
        RouterModule.forRoot(AppRoutes),
        TooltipModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        ReactiveFormsModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        GridComponent,
        BookCardComponent,
        BooksSectionComponent,
        BooksTableComponent,
        BooksDisplayComponent,
        PagesComponent,
        TableItemsComponent,
        PagePipe,
        SearchFilterPipe,
        BookFilterPipe,
      ],
    }),
  ],
}

export const Default = () => ({
  component: BooksDisplayComponent,
  props: {
    books,
    sectionTitle: 'Sectioaaaaasdasn title',
    description: 'A description',
  },
})

export const Clickable = () => ({
  component: BooksDisplayComponent,
  props: {
    books,
    sectionTitle: 'Section title',
    description: 'A description',
    clickable: true,
  },
})

export const Selectable = () => ({
  component: BooksDisplayComponent,
  props: {
    books: [...books, bookInLibrary],
    sectionTitle: 'Section title',
    description: 'A description',
    selectable: true,
    statusIncluded: 'In library',
    statusNotIncluded: 'Not in library',
    statusCannotBeSelected: 'Already in library',
    selectBtnContent: 'Add to library',
    selectBtnContentDisabled: 'Already in library',
  },
})
