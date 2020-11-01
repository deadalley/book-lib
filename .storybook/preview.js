import { setCompodocJson } from '@storybook/addon-docs/angular'
import docJson from '../documentation.json'
setCompodocJson(docJson)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  themes: [
    { name: 'light', color: '#ffffff', default: true },
    { name: 'dark', class: 'dark-theme', color: '#1c1c28' },
  ],
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#ffffff',
      },
      {
        name: 'dark',
        value: '#28293d',
      },
    ],
  },
}
