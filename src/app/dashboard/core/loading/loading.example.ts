import { CommonModule } from '@angular/common'
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { LoadingComponent } from './loading.component'

storiesOf('Loading', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        LoadingModule.forRoot({
          animationType: ANIMATION_TYPES.circleSwish,
          backdropBackgroundColour: 'rgba(0,0,0,0)',
          primaryColour: 'rgb(120, 216, 236)',
          secondaryColour: '#ffffff',
          tertiaryColour: '#ffffff'
        }),
      ],
    })
  )
  .add('default', () => ({
    component: LoadingComponent,
    props: {
      visible: true
    },
  }))
