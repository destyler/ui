import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCollapseContext } from '../hooks/use-collapse-context'
import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

export interface CollapseItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface CollapseItemIndicatorProps
  extends HTMLProps<'div'>,
  CollapseItemIndicatorBaseProps {}

export function CollapseItemIndicator(props: CollapseItemIndicatorProps) {
  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()
  const mergedProps = mergeProps(() => collapse().getItemIndicatorProps(itemProps), props)

  return <ui.div {...mergedProps} />
}
