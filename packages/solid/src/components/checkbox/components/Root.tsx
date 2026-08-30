import type { UseCheckboxProps } from '../hooks/use-checkbox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCheckbox } from '../hooks/use-checkbox'
import { CheckboxProvider } from '../hooks/use-checkbox-context'

export interface CheckboxRootBaseProps extends UseCheckboxProps, PolymorphicProps<'label'> {}
export interface CheckboxRootProps extends HTMLProps<'label'>, CheckboxRootBaseProps {}

export function CheckboxRoot(props: CheckboxRootProps) {
  const [useCheckboxProps, labelprops] = createSplitProps<UseCheckboxProps>()(props, [
    'checked',
    'defaultChecked',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'name',
    'onCheckedChange',
    'readOnly',
    'required',
    'value',
  ])
  const checkbox = useCheckbox(useCheckboxProps)
  const mergedProps = mergeProps(() => checkbox().getRootProps(), labelprops)

  return (
    <CheckboxProvider value={checkbox}>
      <ui.label {...mergedProps} />
    </CheckboxProvider>
  )
}
