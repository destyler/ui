import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchTextBaseProps extends PolymorphicProps<'span'> {}
export interface TreeBranchTextProps extends HTMLProps<'span'>, TreeBranchTextBaseProps {}

export function TreeBranchText(props: TreeBranchTextProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(() => tree().getBranchTextProps(nodeProps), props)

  return <ui.span {...mergedProps} />
}
