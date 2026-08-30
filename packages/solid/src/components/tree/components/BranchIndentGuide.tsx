import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchIndentGuideBaseProps extends PolymorphicProps<'div'> {}
export interface TreeBranchIndentGuideProps
  extends HTMLProps<'div'>,
  TreeBranchIndentGuideBaseProps {}

export function TreeBranchIndentGuide(props: TreeBranchIndentGuideProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(() => tree().getBranchIndentGuideProps(nodeProps), props)

  return <ui.div {...mergedProps} />
}
