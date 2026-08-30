import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface TreeItemIndicatorProps
  extends HTMLProps<'div'>,
  TreeItemIndicatorBaseProps {}

export function TreeItemIndicator(props: TreeItemIndicatorProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(() => tree().getItemIndicatorProps(nodeProps), props)

  return <ui.div {...mergedProps} />
}
