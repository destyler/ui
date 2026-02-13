import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchIndicatorBaseProps extends PolymorphicProps {}
export interface TreeBranchIndicatorProps extends HTMLProps<'div'>, TreeBranchIndicatorBaseProps {}

export const TreeBranchIndicator = forwardRef<HTMLDivElement, TreeBranchIndicatorProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(tree.getBranchIndicatorProps(nodeProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TreeBranchIndicator.displayName = 'TreeBranchIndicator'
