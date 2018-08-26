import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { action } from '@storybook/addon-actions'
import BookFactory from 'factories/book'
import { BookCardComponent } from './book-card.component'

const book = BookFactory.build({ canBeSelected: true })
const bookCannotBeSelected = BookFactory.build({ canBeSelected: false })

storiesOf('Book Card', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        RouterModule,
        TooltipModule,
        BrowserAnimationsModule
      ],
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
      clickable: true
    },
  }))
  .add('selectable', () => ({
    component: BookCardComponent,
    props: {
      book,
      selectable: true,
      selectBtnContent: 'Add to library',
      selectBtnContentDisabled: 'Already in libray'
    },
  }))
  .add('selectable and book cannot be selected', () => ({
    component: BookCardComponent,
    props: {
      book: bookCannotBeSelected,
      selectable: true,
      selectBtnContent: 'Add to library',
      selectBtnContentDisabled: 'Already in libray'
    },
  }))
