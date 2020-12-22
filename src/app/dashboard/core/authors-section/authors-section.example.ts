import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { moduleMetadata } from '@storybook/angular'
import { GridComponent } from '../grid/grid.component'
import { AuthorCardComponent } from '../author-card/author-card.component'
import { AuthorsSectionComponent } from './authors-section.component'
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
import AuthorFactory from 'factories/author.factory'

const authors = AuthorFactory.buildList(4)

export default {
  title: 'Authors Section',
  component: AuthorsSectionComponent,
  decorators: [
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
      declarations: [
        GridComponent,
        AuthorCardComponent,
        AuthorsSectionComponent,
      ],
    }),
  ],
}

export const Default = () => ({
  component: AuthorsSectionComponent,
  props: {
    authors,
    sectionTitle: 'Section Name',
  },
})

export const Clickable = () => ({
  component: AuthorsSectionComponent,
  props: {
    authors,
    sectionTitle: 'Section Name',
    clickable: true,
  },
})
