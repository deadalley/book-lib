import { CommonModule } from '@angular/common'
import { NgxLoadingModule } from 'ngx-loading'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { LoadingOverlayComponent } from './loading-overlay.component'
import loadingConfig from 'utils/loading.config'

storiesOf('LoadingOverlay', module)
  .addDecorator(
    moduleMetadata({
      declarations: [LoadingOverlayComponent],
      imports: [CommonModule, NgxLoadingModule.forRoot(loadingConfig)],
    })
  )
  .add('default', () => ({
    component: LoadingOverlayComponent,
    props: {
      visible: true,
    },
  }))
