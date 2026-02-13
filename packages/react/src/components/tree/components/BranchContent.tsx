import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { Collapsible } from '~/components/collapsible'
import { createSplitProps } from '~/utils/create-split-props'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchContentBaseProps extends PolymorphicProps {}
export interface TreeBranchContentProps extends HTMLProps<'div'>, TreeBranchContentBaseProps {}

interface VisibilityProps {
  'hidden'?: boolean
  'data-state'?: string
}

const splitVisibilityProps = createSplitProps<VisibilityProps>()

export const TreeBranchContent = forwardRef<HTMLDivElement, TreeBranchContentProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const contentProps = tree.getBranchContentProps(nodeProps)

  const [, branchContentProps] = splitVisibilityProps(contentProps, ['hidden', 'data-state'])
  const mergedProps = mergeProps(branchContentProps, props)

  return <Collapsible.Content ref={ref} {...mergedProps} />
})

TreeBranchContent.displayName = 'TreeBranchContent'
