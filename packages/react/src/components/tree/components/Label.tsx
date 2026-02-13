import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTreeContext } from '../hooks/use-tree-context'

export interface TreeLabelBaseProps extends PolymorphicProps {}
export interface TreeLabelProps extends HTMLProps<'label'>, TreeLabelBaseProps {}

export const TreeLabel = forwardRef<HTMLLabelElement, TreeLabelProps>((props, ref) => {
  const tree = useTreeContext()
  const mergedProps = mergeProps(tree.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

TreeLabel.displayName = 'TreeLabel'
