import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchTriggerBaseProps extends PolymorphicProps<'div'> {}
export interface TreeBranchTriggerProps
  extends HTMLProps<'div'>,
  TreeBranchTriggerBaseProps {}

export function TreeBranchTrigger(props: TreeBranchTriggerProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(() => tree().getBranchTriggerProps(nodeProps), props)

  return <ui.div {...mergedProps} />
}
