import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'

export interface TreeTreeBaseProps extends PolymorphicProps {}
export interface TreeTreeProps extends HTMLProps<'div'>, TreeTreeBaseProps {}

export const TreeTree = forwardRef<HTMLDivElement, TreeTreeProps>((props, ref) => {
  const tree = useTreeContext()
  const mergedProps = mergeProps(tree.getTreeProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TreeTree.displayName = 'TreeTree'
