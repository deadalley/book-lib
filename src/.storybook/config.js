import { configure } from '@storybook/angular'

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext)
}

function loadStories() {
  requireAll(require.context("../app", true, /.example.ts$/))
}

configure(loadStories, module)