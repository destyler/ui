import type { UseCheckboxGroupProps } from '../hooks/use-checkbox-group'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { checkboxAnatomy } from '../anatomy'
import { useCheckboxGroup } from '../hooks/use-checkbox-group'
import { CheckboxGroupContextProvider } from '../hooks/use-checkbox-group-context'

export interface CheckboxGroupBaseProps extends UseCheckboxGroupProps, PolymorphicProps {}
export interface CheckboxGroupProps extends Assign<HTMLProps<'div'>, CheckboxGroupBaseProps> {}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>((props, ref) => {
  const [checkboxGroupProps, localProps] = createSplitProps<UseCheckboxGroupProps>()(props, [
    'defaultValue',
    'value',
    'onValueChange',
    'disabled',
    'invalid',
    'readOnly',
    'name',
  ])

  const checkboxGroup = useCheckboxGroup(checkboxGroupProps)

  return (
    <CheckboxGroupContextProvider value={checkboxGroup}>
      <ui.div ref={ref} role="group" {...localProps} {...checkboxAnatomy.build().group.attrs} />
    </CheckboxGroupContextProvider>
  )
})

CheckboxGroup.displayName = 'CheckboxGroup'
