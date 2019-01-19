import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { BookTagsComponent } from './book-tags.component'

storiesOf('Book Tags', module)
  .addDecorator(
    moduleMetadata({
      imports: [CommonModule, RouterModule],
    })
  )
  .add('default', () => ({
    component: BookTagsComponent,
    props: {
      title: 'My tags',
      placeholder: 'placeholder',
      iconClass: 'ps-7s-ticket',
      items: ['Item 1', 'Item 2'],
    },
  }))
  .add('tags', () => ({
    component: BookTagsComponent,
    props: {
      tags: true,
      title: 'My tags',
      placeholder: 'placeholder',
      iconClass: 'ps-7s-ticket',
      items: ['Item 1', 'Item 2'],
    },
  }))
