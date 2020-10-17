import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { AppRoutes } from '../../../app.routing'
import { PoweredByGoodreadsComponent } from './powered-by-goodreads.component'

storiesOf('Powered By Goodreads', module)
  .addDecorator(
    moduleMetadata({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [CommonModule, RouterModule.forRoot(AppRoutes)],
      declarations: [PoweredByGoodreadsComponent],
    })
  )
  .add('default', () => ({
    component: PoweredByGoodreadsComponent,
  }))
