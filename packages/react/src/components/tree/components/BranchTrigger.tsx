import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchTriggerBaseProps extends PolymorphicProps {}
export interface TreeBranchTriggerProps extends HTMLProps<'div'>, TreeBranchTriggerBaseProps {}

export const TreeBranchTrigger = forwardRef<HTMLDivElement, TreeBranchTriggerProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(tree.getBranchTriggerProps(nodeProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TreeBranchTrigger.displayName = 'TreeBranchTrigger'
