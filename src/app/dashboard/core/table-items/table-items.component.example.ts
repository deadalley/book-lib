import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { moduleMetadata } from '@storybook/angular'
import { AppRoutes } from '../../../app.routing'
import { TableItemsComponent } from './table-items.component'

export default {
  title: 'Table Items',
  compoennt: TableItemsComponent,
  decorators: [
    moduleMetadata({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [CommonModule, RouterModule.forRoot(AppRoutes)],
      declarations: [TableItemsComponent],
    }),
  ],
}

export const Default = () => ({
  component: TableItemsComponent,
  props: { count: 12, selectedPage: 4 },
})
