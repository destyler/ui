import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface TreeBranchIndicatorProps
  extends HTMLProps<'div'>,
  TreeBranchIndicatorBaseProps {}

export function TreeBranchIndicator(props: TreeBranchIndicatorProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(() => tree().getBranchIndicatorProps(nodeProps), props)

  return <ui.div {...mergedProps} />
}
