import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { RouterModule } from '@angular/router'
import { moduleMetadata } from '@storybook/angular'
import { AppRoutes } from '../../../app.routing'
import { PagesComponent } from './pages.component'

export default {
  title: 'Pages',
  component: PagesComponent,
  decorators: [
    moduleMetadata({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [CommonModule, RouterModule.forRoot(AppRoutes)],
      declarations: [PagesComponent],
    }),
  ],
}

export const Default = () => ({
  component: PagesComponent,
  props: { count: 12, selectedPage: 7 },
})

export const Count5 = () => ({
  component: PagesComponent,
  props: { count: 5, selectedPage: 2 },
})

export const First = () => ({
  component: PagesComponent,
  props: { count: 12, selectedPage: 1 },
})

export const Last = () => ({
  component: PagesComponent,
  props: { count: 12, selectedPage: 12 },
})

export const CountNotGiven = () => ({
  component: PagesComponent,
  props: { selectedPage: 4 },
})
