import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchIndentGuideBaseProps extends PolymorphicProps {}
export interface TreeBranchIndentGuideProps extends HTMLProps<'div'>, TreeBranchIndentGuideBaseProps {}

export const TreeBranchIndentGuide = forwardRef<HTMLDivElement, TreeBranchIndentGuideProps>((props, ref) => {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(tree.getBranchIndentGuideProps(nodeProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TreeBranchIndentGuide.displayName = 'TreeBranchIndentGuide'
