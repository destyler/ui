import type { Meta, StoryObj } from '@storybook/react'
import { Basic } from '../examples/Basic'
import { Context } from '../examples/Context'
import { RootProvider } from '../examples/RootProvider'

const meta: Meta = {
  title: 'Components / Breadcrumbs',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const BasicExample: StoryObj = {
  render: () => <Basic />,
}

export const RootProviderExample: StoryObj = {
  render: () => <RootProvider />,
}

export const ContextExample: StoryObj = {
  render: () => <Context />,
}
