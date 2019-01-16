import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import AuthorFactory from 'factories/author.factory'
import { AuthorCardComponent } from './author-card.component'

const author = AuthorFactory.build()

storiesOf('Author Card', module)
  .addDecorator(
    moduleMetadata({
      imports: [CommonModule, RouterModule, BrowserAnimationsModule],
    })
  )
  .add('default', () => ({
    component: AuthorCardComponent,
    props: {
      author,
    },
  }))
