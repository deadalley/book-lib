import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-tooltip'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { BookTagsComponent } from './book-tags.component'

storiesOf('Book Tags', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        RouterModule,
        TooltipModule
      ],
    })
  )
  .add('default', () => ({
    component: BookTagsComponent,
    props: {
      title: 'My tags',
      placeholder: 'placeholder',
      iconClass: 'ps-7s-ticket',
      items: ['Item 1', 'Item 2']
    },
  }))
