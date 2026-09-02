import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { Collapsible } from '~/components/collapsible'
import { createSplitProps } from '~/utils/create-split-props'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeBranchContentBaseProps extends PolymorphicProps<'div'> {}
export interface TreeBranchContentProps
  extends HTMLProps<'div'>,
  TreeBranchContentBaseProps {}

interface VisibilityProps {
  'hidden'?: boolean
  'data-state'?: string
}

const splitVisibilityProps = createSplitProps<VisibilityProps>()

export function TreeBranchContent(props: TreeBranchContentProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()

  const branchContentProps = createMemo(() => {
    const contentProps = tree().getBranchContentProps(nodeProps)
    const [, ownProps] = splitVisibilityProps(contentProps as VisibilityProps, [
      'hidden',
      'data-state',
    ])
    return ownProps
  })
  const mergedProps = mergeProps(() => branchContentProps(), props)

  return <Collapsible.Content {...mergedProps} />
}
