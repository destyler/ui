import type { CheckboxRootProps, ToggleRootProps } from '@destyler-ui/svelte'
import { useToggleContext } from '@destyler-ui/svelte/toggle'

export const toggleProps: ToggleRootProps = { defaultPressed: false, onPressedChange: value => value satisfies boolean }
export const checkboxProps: CheckboxRootProps = { defaultChecked: true }
export const context = () => useToggleContext()().pressed satisfies boolean

// @ts-expect-error The public props must not collapse to any.
export const invalid: ToggleRootProps = { defaultPressed: 'yes' }
