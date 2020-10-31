import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata, Meta } from '@storybook/angular'
import AuthorFactory from 'factories/author.factory'
import { AuthorCardComponent } from './author-card.component'

const author = AuthorFactory.build()

export default {
  title: 'Author Card',
  component: AuthorCardComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterModule, BrowserAnimationsModule],
    }),
  ],
}

export const Default = () => ({
  component: AuthorCardComponent,
  props: {
    author,
  },
})

export const Clickable = () => ({
  component: AuthorCardComponent,
  props: {
    author,
    clickable: true,
  },
})
