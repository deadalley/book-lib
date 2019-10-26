import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { AppRoutes } from '../../../app.routing'
import { TableItemsComponent } from './table-items.component'

storiesOf('Table Items', module)
  .addDecorator(
    moduleMetadata({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [CommonModule, RouterModule.forRoot(AppRoutes)],
      declarations: [TableItemsComponent],
    })
  )
  .add('default', () => ({
    component: TableItemsComponent,
    props: { count: 12, selectedPage: 4 },
  }))
