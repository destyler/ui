import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'

export interface TreeLabelBaseProps extends PolymorphicProps<'label'> {}
export interface TreeLabelProps extends HTMLProps<'label'>, TreeLabelBaseProps {}

export function TreeLabel(props: TreeLabelProps) {
  const tree = useTreeContext()
  const mergedProps = mergeProps(() => tree().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
