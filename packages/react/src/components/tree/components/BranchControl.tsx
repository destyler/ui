import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchControlBaseProps extends PolymorphicProps {}
export interface TreeBranchControlProps extends HTMLProps<'div'>, TreeBranchControlBaseProps {}

export const TreeBranchControl = forwardRef<HTMLDivElement, TreeBranchControlProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(tree.getBranchControlProps(nodeProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TreeBranchControl.displayName = 'TreeBranchControl'
