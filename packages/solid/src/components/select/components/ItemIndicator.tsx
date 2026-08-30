import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'
import { useSelectItemPropsContext } from '../hooks/use-select-item-props-context'

export interface SelectItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface SelectItemIndicatorProps extends HTMLProps<'div'>, SelectItemIndicatorBaseProps {}

export function SelectItemIndicator(props: SelectItemIndicatorProps) {
  const select = useSelectContext()
  const itemProps = useSelectItemPropsContext()
  const mergedProps = mergeProps(() => select().getItemIndicatorProps(itemProps), props)

  return <ui.div {...mergedProps} />
}
