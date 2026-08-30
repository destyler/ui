import type { UseCheckboxGroupProps } from '../hooks/use-checkbox-group'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { checkboxAnatomy } from '../anatomy'
import { useCheckboxGroup } from '../hooks/use-checkbox-group'
import { CheckboxGroupContextProvider } from '../hooks/use-checkbox-group-context'

export interface CheckboxGroupBaseProps extends UseCheckboxGroupProps, PolymorphicProps<'div'> {}
export interface CheckboxGroupProps extends HTMLProps<'div'>, CheckboxGroupBaseProps {}

export function CheckboxGroup(props: CheckboxGroupProps) {
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
      <ui.div role="group" {...localProps} {...checkboxAnatomy.build().group.attrs} />
    </CheckboxGroupContextProvider>
  )
}
