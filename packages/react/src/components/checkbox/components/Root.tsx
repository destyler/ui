import type { UseCheckboxProps } from '../hooks/use-checkbox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCheckbox } from '../hooks/use-checkbox'
import { CheckboxProvider } from '../hooks/use-checkbox-context'

export interface CheckboxRootBaseProps extends UseCheckboxProps, PolymorphicProps {}
export interface CheckboxRootProps extends Assign<HTMLProps<'label'>, CheckboxRootBaseProps> {}

export const CheckboxRoot = forwardRef<HTMLLabelElement, CheckboxRootProps>((props, ref) => {
  const [useCheckboxProps, localProps] = createSplitProps<UseCheckboxProps>()(props, [
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
  const mergedProps = mergeProps(checkbox.getRootProps(), localProps)

  return (
    <CheckboxProvider value={checkbox}>
      <ui.label {...mergedProps} ref={ref} />
    </CheckboxProvider>
  )
})

CheckboxRoot.displayName = 'CheckboxRoot'
