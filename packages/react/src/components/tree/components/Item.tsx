import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeItemBaseProps extends PolymorphicProps {}
export interface TreeItemProps extends Assign<HTMLProps<'div'>, TreeItemBaseProps> {}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(tree.getItemProps(nodeProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TreeItem.displayName = 'TreeItem'
