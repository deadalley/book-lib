import { CommonModule } from '@angular/common'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { LanguageSelectorComponent } from './language-selector.component'

storiesOf('Language Selector', module)
  .addDecorator(
    moduleMetadata({
      imports: [CommonModule],
      declarations: [LanguageSelectorComponent],
    })
  )
  .add('default', () => ({
    component: LanguageSelectorComponent,
  }))
