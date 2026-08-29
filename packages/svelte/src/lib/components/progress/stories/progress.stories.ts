import type { Meta } from '@storybook/svelte-vite'
import type { Component } from 'svelte'
import BasicExample from '../examples/Basic.svelte'
import CircularBasicExample from '../examples/circular/Basic.svelte'
import CircularControlledExample from '../examples/circular/Controlled.svelte'
import CircularIndeterminateExample from '../examples/circular/Indeterminate.svelte'
import CircularInitialValueExample from '../examples/circular/InitialValue.svelte'
import CircularMinMaxExample from '../examples/circular/MinMax.svelte'
import CircularRootProviderExample from '../examples/circular/RootProvider.svelte'
import CircularValueTextExample from '../examples/circular/ValueText.svelte'
import LinearBasicExample from '../examples/linear/Basic.svelte'
import LinearControlledExample from '../examples/linear/Controlled.svelte'
import LinearIndeterminateExample from '../examples/linear/Indeterminate.svelte'
import LinearInitialValueExample from '../examples/linear/InitialValue.svelte'
import LinearMinMaxExample from '../examples/linear/MinMax.svelte'
import LinearRootProviderExample from '../examples/linear/RootProvider.svelte'
import LinearValueTextExample from '../examples/linear/ValueText.svelte'

const meta: Meta = {
  title: 'Components / Data / Progress',
  parameters: { layout: 'fullscreen' },
}

export default meta

const story = (Component: Component<any>) => ({ render: () => ({ Component }) })

export const Basic = story(BasicExample)

export const CircularBasic = story(CircularBasicExample)
export const CircularControlled = story(CircularControlledExample)
export const CircularIndeterminate = story(CircularIndeterminateExample)
export const CircularInitialValue = story(CircularInitialValueExample)
export const CircularMinMax = story(CircularMinMaxExample)
export const CircularRootProvider = story(CircularRootProviderExample)
export const CircularValueText = story(CircularValueTextExample)

export const LinearBasic = story(LinearBasicExample)
export const LinearControlled = story(LinearControlledExample)
export const LinearIndeterminate = story(LinearIndeterminateExample)
export const LinearInitialValue = story(LinearInitialValueExample)
export const LinearMinMax = story(LinearMinMaxExample)
export const LinearRootProvider = story(LinearRootProviderExample)
export const LinearValueText = story(LinearValueTextExample)
