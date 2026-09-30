import { Checkbox, Collapsible, Toggle, useToggleContext } from '@destyler-ui/vue'
import { h } from 'vue'

const toggleProps: Toggle.RootProps = { defaultPressed: false }
const checkboxProps: Checkbox.RootProps = { defaultChecked: true }
const collapseProps: Collapsible.RootProps = { defaultOpen: false }
export const examples = [h(Toggle.Root, toggleProps), h(Checkbox.Root, checkboxProps), h(Collapsible.Root, collapseProps)]
export const readContext = () => useToggleContext().value.pressed satisfies boolean

// @ts-expect-error The public props must not collapse to any.
export const invalid: Toggle.RootProps = { defaultPressed: 'yes' }
