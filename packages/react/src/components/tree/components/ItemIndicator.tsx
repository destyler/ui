import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeItemIndicatorBaseProps extends PolymorphicProps {}
export interface TreeItemIndicatorProps extends HTMLProps<'div'>, TreeItemIndicatorBaseProps {}

export const TreeItemIndicator = forwardRef<HTMLDivElement, TreeItemIndicatorProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(tree.getItemIndicatorProps(nodeProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TreeItemIndicator.displayName = 'TreeItemIndicator'
