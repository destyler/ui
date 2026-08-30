import type { Meta } from 'storybook-solidjs-vite'

const meta: Meta = {
  title: 'Components / Collapse',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export { Basic } from '../examples/Basic'
export { Collapsible } from '../examples/Collapsible'
export { ContextFocusedValue } from '../examples/ContextFocusedValue'
export { ContextGetItemState } from '../examples/ContextGetItemState'
export { ContextSetValue } from '../examples/ContextSetValue'
export { ContextValue } from '../examples/ContextValue'
export { Controlled } from '../examples/Controlled'
export { Disabled } from '../examples/Disabled'
export { Horizontal } from '../examples/Horizontal'
export { Multiple } from '../examples/Multiple'
export { Provider } from '../examples/provider'
export { RenderProp } from '../examples/RenderProp'
export { RootProvider } from '../examples/RootProvider'
export { Vertical } from '../examples/Vertical'
