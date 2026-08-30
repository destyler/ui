import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchControlBaseProps extends PolymorphicProps<'div'> {}
export interface TreeBranchControlProps
  extends HTMLProps<'div'>,
  TreeBranchControlBaseProps {}

export function TreeBranchControl(props: TreeBranchControlProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(() => tree().getBranchControlProps(nodeProps), props)

  return <ui.div {...mergedProps} />
}
