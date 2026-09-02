import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'

export interface TreeTreeBaseProps extends PolymorphicProps<'div'> {}
export interface TreeTreeProps extends HTMLProps<'div'>, TreeTreeBaseProps {}

export function TreeTree(props: TreeTreeProps) {
  const tree = useTreeContext()
  const mergedProps = mergeProps(() => tree().getTreeProps(), props)

  return <ui.div {...mergedProps} />
}
