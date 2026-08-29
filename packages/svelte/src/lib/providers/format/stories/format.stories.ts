import type { Meta, StoryObj } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import ByteBasicExample from '../examples/ByteBasic.svelte'
import ByteLocaleExample from '../examples/ByteLocale.svelte'
import ByteSizeExample from '../examples/ByteSize.svelte'
import ByteWithUnitExample from '../examples/ByteWithUnit.svelte'
import ByteWithUnitDisplayExample from '../examples/ByteWithUnitDisplay.svelte'
import NumberBasicExample from '../examples/NumberBasic.svelte'
import NumberWithCompactExample from '../examples/NumberWithCompact.svelte'
import NumberWithCurrencyExample from '../examples/NumberWithCurrency.svelte'
import NumberWithLocaleExample from '../examples/NumberWithLocale.svelte'
import NumberWithPercentageExample from '../examples/NumberWithPercentage.svelte'
import NumberWithUnitExample from '../examples/NumberWithUnit.svelte'

const meta: Meta = {
  title: 'Providers / Content / Format',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

const story = (Component: Component<any>): Story => ({ render: () => ({ Component }) })

export const ByteBasic: Story = story(ByteBasicExample)
export const ByteLocale: Story = story(ByteLocaleExample)
export const ByteSize: Story = story(ByteSizeExample)
export const ByteWithUnit: Story = story(ByteWithUnitExample)
export const ByteWithUnitDisplay: Story = story(ByteWithUnitDisplayExample)
export const NumberBasic: Story = story(NumberBasicExample)
export const NumberWithCompact: Story = story(NumberWithCompactExample)
export const NumberWithCurrency: Story = story(NumberWithCurrencyExample)
export const NumberWithLocale: Story = story(NumberWithLocaleExample)
export const NumberWithPercentage: Story = story(NumberWithPercentageExample)
export const NumberWithUnit: Story = story(NumberWithUnitExample)
