import { UiComponent } from './ui.component'

export default {
  title: 'UI',
}

export const DefaultTheme = () => ({
  component: UiComponent,
})

export const DarkTheme = () => ({
  component: UiComponent,
  props: { dark: true },
})
