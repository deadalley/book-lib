import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { BooksTableComponent } from './books-table.component'
import BookFactory from 'factories/book'

const books = BookFactory.buildList(5, { canBeSelected: true, isSelected: true })
const bookInLibrary = BookFactory.build({ canBeSelected: false, isSelected: false })

storiesOf('Books Table', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        RouterModule,
        TooltipModule.forRoot(),
        BrowserAnimationsModule
      ],
    })
  )
  .add('default', () => ({
    component: BooksTableComponent,
    props: {
      books,
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true
    },
  }))
  .add('selectable', () => ({
    component: BooksTableComponent,
    props: {
      books: [...books, bookInLibrary],
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true,
      selectable: true,
      statusIncluded: 'In library',
      statusNotIncluded: 'Not in library',
      statusCannotBeSelected: 'Already in library',
    },
  }))
  .add('clickable', () => ({
    component: BooksTableComponent,
    props: {
      books,
      sectionTitle: 'Section title',
      description: 'A description',
      withButtons: true,
      clickable: true,
    },
  }))
