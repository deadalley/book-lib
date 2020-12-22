import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { moduleMetadata } from '@storybook/angular'
import { GridComponent } from '../grid/grid.component'
import { AuthorCardComponent } from '../author-card/author-card.component'
import { AuthorsSectionComponent } from '../authors-section/authors-section.component'
import { AuthorsTableComponent } from '../authors-table/authors-table.component'
import { AuthorsDisplayComponent } from './authors-display.component'
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import AuthorFactory from 'factories/author.factory'
import { UiService } from 'services/ui.service'
import { PagePipe } from 'pipes/page.pipe'
import { SearchFilterPipe } from 'pipes/search-filter.pipe'
import { PagesComponent } from '../pages/pages.component'
import { AppRoutes } from '../../../app.routing'

const authors = AuthorFactory.buildList(13)

export default {
  title: 'Authors Display',
  component: AuthorsDisplayComponent,
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
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        GridComponent,
        AuthorCardComponent,
        AuthorsSectionComponent,
        AuthorsTableComponent,
        AuthorsDisplayComponent,
        PagesComponent,
        PagePipe,
        SearchFilterPipe,
      ],
    }),
  ],
}

export const Default = () => ({
  component: AuthorsDisplayComponent,
  props: {
    authors,
  },
})

export const Clickable = () => ({
  component: AuthorsDisplayComponent,
  props: {
    authors,
    clickable: true,
  },
})
