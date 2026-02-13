import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { Collapsible } from '~/components/collapsible'
import { useRenderStrategyPropsContext } from '~/utils/render-strategy'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchBaseProps extends PolymorphicProps {}
export interface TreeBranchProps extends Assign<HTMLProps<'div'>, TreeBranchBaseProps> {}

export const TreeBranch = forwardRef<HTMLDivElement, TreeBranchProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const renderStrategyProps = useRenderStrategyPropsContext()
  const node = tree.getNodeState(nodeProps)
  const mergedProps = mergeProps(tree.getBranchProps(nodeProps), props)
  const branchContentProps = tree.getBranchContentProps(nodeProps)

  return (
    <Collapsible.Root
      ref={ref}
      open={node.expanded}
      ids={{ content: branchContentProps.id }}
      {...renderStrategyProps}
      {...mergedProps}
    />
  )
})

TreeBranch.displayName = 'TreeBranch'
