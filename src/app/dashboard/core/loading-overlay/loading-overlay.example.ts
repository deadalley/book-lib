import { CommonModule } from '@angular/common'
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { LoadingOverlayComponent } from './loading-overlay.component'

storiesOf('LoadingOverlay', module)
  .addDecorator(
    moduleMetadata({
      declarations: [LoadingOverlayComponent],
      imports: [
        CommonModule,
        NgxLoadingModule.forRoot({
          animationType: ngxLoadingAnimationTypes.circleSwish,
          backdropBackgroundColour: 'rgba(100,0,0,0)',
          primaryColour: 'rgb(120, 216, 236)',
          secondaryColour: '#ffffff',
          tertiaryColour: '#ffffff',
        }),
      ],
    })
  )
  .add('default', () => ({
    component: LoadingOverlayComponent,
    props: {
      visible: true,
    },
  }))
