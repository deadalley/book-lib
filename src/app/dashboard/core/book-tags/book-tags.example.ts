import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { moduleMetadata } from '@storybook/angular'
import { BookTagsComponent } from './book-tags.component'
import { SearchFilterPipe } from 'pipes/search-filter.pipe'

export default {
  title: 'Book Tags',
  component: BookTagsComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
      declarations: [BookTagsComponent, SearchFilterPipe],
    }),
  ],
}

const Template = (_props: any) => ({
  component: BookTagsComponent,
  props: {
    title: 'Add tag',
    placeholder: 'New tag',
    items: ['Item 1', 'Item 2'],
    suggestions: ['Item 1', 'Item 2'],
    ..._props,
  },
})

export const Default = Template.bind({})

export const WithIcon = Template.bind({})
WithIcon.args = {
  iconClass: 'ti-gift',
}

export const TagStyle = Template.bind({})
TagStyle.args = {
  tags: true,
  iconClass: 'ti-gift',
}
