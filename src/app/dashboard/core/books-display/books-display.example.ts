import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule } from '@angular/forms'
import { moduleMetadata } from '@storybook/angular'
import { AngularFireModule } from 'angularfire2'
import {
  AngularFireDatabase,
  AngularFireDatabaseModule,
} from 'angularfire2/database'
import {
  AngularFireStorage,
  AngularFireStorageModule,
} from 'angularfire2/storage'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { GridComponent } from '../grid/grid.component'
import { BookCardComponent } from '../book-card/book-card.component'
import { BookButtonComponent } from '../book-button/book-button.component'
import { BooksSectionComponent } from '../books-section/books-section.component'
import { BooksTableComponent } from '../books-table/books-table.component'
import { BooksDisplayComponent } from './books-display.component'
import { LibraryService } from 'services/library.service'
import { GoodreadsService } from 'services/goodreads.service'
import { DatabaseService } from 'services/database.service'
import { SessionService } from 'services/session.service'
import { environment } from 'environments/environment'
import BookFactory from 'factories/book.factory'
import { UiService } from 'services/ui.service'
import { PagePipe } from 'pipes/page.pipe'
import { SearchFilterPipe } from 'pipes/search-filter.pipe'
import { BookFilterPipe } from 'pipes/book-filter.pipe'
import { PagesComponent } from '../pages/pages.component'
import { AppRoutes } from '../../../app.routing'
import { TableItemsComponent } from '../table-items/table-items.component'

const books = BookFactory.buildList(23, {
  canBeSelected: true,
  isSelected: true,
})

export default {
  title: 'Books Display',
  component: BooksDisplayComponent,
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
        AngularFireModule.initializeApp(environment.firebaseConfig),
        ReactiveFormsModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        GridComponent,
        BookButtonComponent,
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
  },
})

export const WithMoreBooksPerPage = () => ({
  component: BooksDisplayComponent,
  props: {
    books,
    bookCardsInRow: 5,
    maxBooksPerPage: 15,
  },
})

export const WithButtons = () => ({
  component: BooksDisplayComponent,
  props: {
    books,
    withButtons: true,
  },
})

export const Clickable = () => ({
  component: BooksDisplayComponent,
  props: {
    books,
    clickable: true,
  },
})

export const Linkable = () => ({
  component: BooksDisplayComponent,
  props: {
    books,
    linkable: true,
    withButtons: true,
  },
})

export const Selectable = () => ({
  component: BooksDisplayComponent,
  props: {
    books,
    selectable: true,
  },
})
