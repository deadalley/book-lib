import { CommonModule } from '@angular/common'
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { LoadingComponent } from './loading.component'

storiesOf('Loading', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        NgxLoadingModule.forRoot({
          animationType: ngxLoadingAnimationTypes.circleSwish,
          backdropBackgroundColour: 'rgba(0,0,0,0)',
          primaryColour: 'rgb(120, 216, 236)',
          secondaryColour: '#ffffff',
          tertiaryColour: '#ffffff',
        }),
      ],
    })
  )
  .add('default', () => ({
    component: LoadingComponent,
    props: {
      visible: true,
    },
  }))
