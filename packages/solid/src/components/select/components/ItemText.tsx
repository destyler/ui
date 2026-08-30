import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'
import { useSelectItemPropsContext } from '../hooks/use-select-item-props-context'

export interface SelectItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface SelectItemTextProps extends HTMLProps<'span'>, SelectItemTextBaseProps {}

export function SelectItemText(props: SelectItemTextProps) {
  const select = useSelectContext()
  const itemProps = useSelectItemPropsContext()
  const mergedProps = mergeProps(() => select().getItemTextProps(itemProps), props)

  return <ui.span {...mergedProps} />
}
