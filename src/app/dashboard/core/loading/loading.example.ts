import { CommonModule } from '@angular/common'
import { NgxLoadingModule } from 'ngx-loading'
import { moduleMetadata } from '@storybook/angular'
import { LoadingComponent } from './loading.component'
import loadingConfig from 'utils/loading.config'

export default {
  title: 'Loading',
  component: LoadingComponent,
  decorators: [
    moduleMetadata({
      declarations: [LoadingComponent],
      imports: [CommonModule, NgxLoadingModule.forRoot(loadingConfig)],
    }),
  ],
}

export const Default = () => ({
  component: LoadingComponent,
  props: {
    visible: true,
  },
})
