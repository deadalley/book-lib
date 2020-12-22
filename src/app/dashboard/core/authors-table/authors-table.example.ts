import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { moduleMetadata } from '@storybook/angular'
import { AuthorsTableComponent } from './authors-table.component'
import AuthorFactory from 'factories/author.factory'
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

const authors = AuthorFactory.buildList(4)

export default {
  title: 'Authors Table',
  component: AuthorsTableComponent,
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
      declarations: [AuthorsTableComponent],
    }),
  ],
}

export const Default = () => ({
  component: AuthorsTableComponent,
  props: {
    authors,
  },
})

export const Clickable = () => ({
  component: AuthorsTableComponent,
  props: {
    authors,
    clickable: true,
  },
})
