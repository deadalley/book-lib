import { setCompodocJson } from '@storybook/addon-docs/angular'
import docJson from '../documentation.json'
setCompodocJson(docJson)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  themes: [
    { name: 'light', color: 'ffffff', default: true },
    { name: 'dark', class: 'dark-theme', color: '000000' },
  ],
}
