import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { storiesOf, moduleMetadata } from '@storybook/angular'
import { UiService } from '../../../../services/ui.service'
import { TagsListComponent } from './tags-list.component'

const tags = ['tag1', 'tag2', 'tag3', 'the best tag']

storiesOf('Tags List', module)
  .addDecorator(
    moduleMetadata({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, UiService],
      imports: [CommonModule],
      declarations: [TagsListComponent],
    })
  )
  .add('default', () => ({
    component: TagsListComponent,
    props: {
      tags,
    },
  }))
