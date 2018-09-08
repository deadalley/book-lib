import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { BookButtonsComponent } from './book-buttons.component'

storiesOf('Book Buttons', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        TooltipModule.forRoot(),
        RouterModule
      ],
    })
  )
  .add('default', () => ({
    component: BookButtonsComponent,
    props: {
      owned: true,
      favorite: true,
      read: false,
    },
  }))
