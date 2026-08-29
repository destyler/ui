import type { Meta } from '@storybook/svelte-vite'
import BasicExample from '../examples/Basic.svelte'
import WithCheckboxExample from '../examples/WithCheckbox.svelte'
import WithFieldExample from '../examples/WithField.svelte'

const meta: Meta = {
  title: 'Components / Form / Fieldset',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Basic = {
  render: () => ({
    Component: BasicExample,
  }),
}

export const WithCheckbox = {
  render: () => ({
    Component: WithCheckboxExample,
  }),
}

export const WithField = {
  render: () => ({
    Component: WithFieldExample,
  }),
}
