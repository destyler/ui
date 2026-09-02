import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { Collapsible } from '~/components/collapsible'
import { useRenderStrategyContext } from '~/utils/render-strategy'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchBaseProps extends PolymorphicProps<'div'> {}
export interface TreeBranchProps extends Assign<HTMLProps<'div'>, TreeBranchBaseProps> {}

export function TreeBranch(props: TreeBranchProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const renderStrategyProps = useRenderStrategyContext()
  const nodeState = createMemo(() => tree().getNodeState(nodeProps))
  const branchContentProps = tree().getBranchContentProps(nodeProps)
  const mergedProps = mergeProps(() => tree().getBranchProps(nodeProps), props)

  return (
    <Collapsible.Root
      open={nodeState().expanded}
      ids={{ content: branchContentProps.id }}
      {...renderStrategyProps}
      {...mergedProps}
    />
  )
}
