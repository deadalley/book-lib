import { CommonModule } from '@angular/common'
import { moduleMetadata } from '@storybook/angular'
import { BookButtonComponent } from './book-button.component'

export default {
  title: 'Book Button',
  component: BookButtonComponent,
  decorators: [
    moduleMetadata({
      declarations: [BookButtonComponent],
      imports: [CommonModule],
    }),
  ],
}

export const Default = () => ({
  component: BookButtonComponent,
  props: {
    iconClass: 'ti-briefcase',
    type: 'read',
  },
})

export const Active = () => ({
  component: BookButtonComponent,
  props: {
    iconClass: 'ti-briefcase',
    type: 'read',
    active: true,
  },
})
