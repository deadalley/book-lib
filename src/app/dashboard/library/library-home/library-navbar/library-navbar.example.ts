import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { AppRoutes } from '../../../../app.routing'
import { UiService } from '../../../../../services/ui.service'
import { LibraryNavbarComponent } from './library-navbar.component'
import {
  BOOK_ORDERINGS,
  COLLECTION_ORDERINGS,
} from '../../../../../utils/constants'

storiesOf('Library Navbar', module)
  .addDecorator(
    moduleMetadata({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, UiService],
      imports: [
        CommonModule,
        RouterModule.forRoot(AppRoutes),
        BrowserAnimationsModule,
      ],
    })
  )
  .add('Books', () => ({
    component: LibraryNavbarComponent,
    props: {
      orderings: BOOK_ORDERINGS,
      addButtonContent: 'Add a new book',
    },
  }))
  .add('Collections', () => ({
    component: LibraryNavbarComponent,
    props: {
      orderings: COLLECTION_ORDERINGS,
      addButtonContent: 'Add a new collection',
    },
  }))
