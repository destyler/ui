import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'
import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

export interface TreeItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface TreeItemTextProps extends HTMLProps<'span'>, TreeItemTextBaseProps {}

export function TreeItemText(props: TreeItemTextProps) {
  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(() => tree().getItemTextProps(nodeProps), props)

  return <ui.span {...mergedProps} />
}
