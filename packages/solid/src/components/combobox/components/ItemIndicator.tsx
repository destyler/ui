import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'
import { useComboboxItemPropsContext } from '../hooks/use-combobox-item-props-context'

export interface ComboboxItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxItemIndicatorProps
  extends HTMLProps<'div'>,
  ComboboxItemIndicatorBaseProps {}

export function ComboboxItemIndicator(props: ComboboxItemIndicatorProps) {
  const combobox = useComboboxContext()
  const itemProps = useComboboxItemPropsContext()
  const mergedProps = mergeProps(() => combobox().getItemIndicatorProps(itemProps), props)

  return <ui.div {...mergedProps} />
}
