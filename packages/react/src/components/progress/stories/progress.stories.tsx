const meta = {
  title: 'Components / Progress',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export { Basic } from '../examples/Basic'

// Linear examples
export { Basic as LinearBasic } from '../examples/linear/Basic'
export { Controlled as LinearControlled } from '../examples/linear/Controlled'
export { RootProvider as LinearRootProvider } from '../examples/linear/RootProvider'
export { Indeterminate as LinearIndeterminate } from '../examples/linear/Indeterminate'
export { InitialValue as LinearInitialValue } from '../examples/linear/InitialValue'
export { MinMax as LinearMinMax } from '../examples/linear/MinMax'
export { ValueText as LinearValueText } from '../examples/linear/ValueText'

// Circular examples
export { Basic as CircularBasic } from '../examples/circular/Basic'
export { Controlled as CircularControlled } from '../examples/circular/Controlled'
export { RootProvider as CircularRootProvider } from '../examples/circular/RootProvider'
export { Indeterminate as CircularIndeterminate } from '../examples/circular/Indeterminate'
export { InitialValue as CircularInitialValue } from '../examples/circular/InitialValue'
export { MinMax as CircularMinMax } from '../examples/circular/MinMax'
export { ValueText as CircularValueText } from '../examples/circular/ValueText'
