import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { useComboboxItemGroupPropsContext } from '../hooks/use-combobox-item-group-props-context'

export interface ComboboxItemGroupLabelBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxItemGroupLabelProps
  extends HTMLProps<'div'>,
  ComboboxItemGroupLabelBaseProps {}

export function ComboboxItemGroupLabel(props: ComboboxItemGroupLabelProps) {
  const combobox = useComboboxContext()
  const itemGroupProps = useComboboxItemGroupPropsContext()
  const mergedProps = mergeProps(
    () => combobox().getItemGroupLabelProps({ htmlFor: itemGroupProps.id }),
    props,
  )

  return <ui.div {...mergedProps} />
}
