import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { moduleMetadata } from '@storybook/angular'
import { BookButtonsComponent } from './book-buttons.component'

export default {
  title: 'Book Buttons',
  component: BookButtonsComponent,
  decorators: [
    moduleMetadata({
      declarations: [BookButtonsComponent],
      imports: [CommonModule, TooltipModule.forRoot(), RouterModule],
    }),
  ],
}

export const Default = () => ({
  component: BookButtonsComponent,
  props: {
    owned: true,
    favorite: true,
    read: false,
    wishlist: false,
  },
})
