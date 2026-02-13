import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeItemTextBaseProps extends PolymorphicProps {}
export interface TreeItemTextProps extends HTMLProps<'span'>, TreeItemTextBaseProps {}

export const TreeItemText = forwardRef<HTMLSpanElement, TreeItemTextProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(tree.getItemTextProps(nodeProps), props)

  return <ui.span {...mergedProps} ref={ref} />
})

TreeItemText.displayName = 'TreeItemText'
