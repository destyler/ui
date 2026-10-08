import type { CheckboxRootProps, ToggleRootProps } from '@destyler-ui/svelte'
import type { UseCheckboxGroupReturn } from '@destyler-ui/svelte/checkbox'
import { useToggleContext } from '@destyler-ui/svelte/toggle'

export const toggleProps: ToggleRootProps = { defaultPressed: false, onPressedChange: value => value satisfies boolean }
export const checkboxProps: CheckboxRootProps = { defaultChecked: true }
export const context = () => useToggleContext()().pressed satisfies boolean

// @ts-expect-error The public props must not collapse to any.
export const invalid: ToggleRootProps = { defaultPressed: 'yes' }

// @ts-expect-error Context values must retain the published adapter's boolean type.
export const invalidContext: string = context()

// The group API retains normalized Boolean outputs and its original callback
// signature while compound checkboxes can supply their own Field defaults.
export function checkboxGroupContract(group: ReturnType<UseCheckboxGroupReturn>) {
  const item = group.getItemProps({ value: 'one' })
  const disabled: boolean = item.disabled
  const readOnly: boolean = item.readOnly
  const invalid: boolean = item.invalid
  const mapped = [{ value: 'one' }].map(group.getItemProps)
  const inherited = group.getItemProps({ value: 'one' }, { disabled: true, readOnly: false, invalid: true })
  // @ts-expect-error Inherited flags must remain Boolean options.
  group.getItemProps({ value: 'one' }, { disabled: 'yes' })
  return [disabled, readOnly, invalid, mapped[0].disabled, inherited.disabled] satisfies boolean[]
}
