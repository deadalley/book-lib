import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { AppRoutes } from '../../../app.routing'
import { PagesComponent } from './pages.component'

storiesOf('Pages', module)
  .addDecorator(
    moduleMetadata({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [CommonModule, RouterModule.forRoot(AppRoutes)],
    })
  )
  .add('default', () => ({
    component: PagesComponent,
    props: { count: 12, selectedPage: 4 },
  }))
  .add('first', () => ({
    component: PagesComponent,
    props: { count: 12, selectedPage: 1 },
  }))
  .add('last', () => ({
    component: PagesComponent,
    props: { count: 12, selectedPage: 12 },
  }))
  .add('with no count given', () => ({
    component: PagesComponent,
  }))
