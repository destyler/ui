import { Checkbox, Toggle, useToggleContext } from '@destyler-ui/solid'

export { Fixture } from './Fixture.js'
const toggleProps: Toggle.RootProps = { defaultPressed: false, onPressedChange: value => value satisfies boolean }
export const example = <Toggle.Root {...toggleProps}>Toggle</Toggle.Root>
export const checkbox = <Checkbox.Root defaultChecked><Checkbox.Control /><Checkbox.Label>Check</Checkbox.Label><Checkbox.HiddenInput /></Checkbox.Root>
export const context = () => useToggleContext()().pressed satisfies boolean

// @ts-expect-error The public props must not collapse to any.
export const invalid: Toggle.RootProps = { defaultPressed: 'yes' }
