import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TooltipModule } from 'ngx-tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import AuthorFactory from 'factories/author'
import { AuthorCardComponent } from './author-card.component'

const author = AuthorFactory.build()

storiesOf('Author Card', module)
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
    component: AuthorCardComponent,
    props: {
      author,
    },
  }))
