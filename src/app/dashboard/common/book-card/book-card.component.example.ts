import { storiesOf } from '@storybook/angular'
import { BookCardComponent } from './book-card.component'
import { TooltipModule } from 'ngx-tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import '../../../../assets/css/paper-dashboard.css'

import './book-card.component.css'

storiesOf('BookCard', module)
  .add('default', () => ({
    component: BookCardComponent,
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        TooltipModule
      ]
    },
    props: {
      book: {
        id: 1,
        title: 'Harry Potter and The Philosopher`s Stone',
        author: 'J.K. Rowling',
        image_large: '../../../../assets/img/hp01.jpeg',
        owned: true,
        read: true,
        favorite: false,
        goodreads: false
      }
    },
  }))
