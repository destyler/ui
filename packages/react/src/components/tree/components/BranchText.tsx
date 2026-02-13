import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchTextBaseProps extends PolymorphicProps {}
export interface TreeBranchTextProps extends HTMLProps<'span'>, TreeBranchTextBaseProps {}

export const TreeBranchText = forwardRef<HTMLSpanElement, TreeBranchTextProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(tree.getBranchTextProps(nodeProps), props)

  return <ui.span {...mergedProps} ref={ref} />
})

TreeBranchText.displayName = 'TreeBranchText'
