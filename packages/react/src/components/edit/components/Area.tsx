import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditAreaBaseProps extends PolymorphicProps {}
export interface EditAreaProps extends HTMLProps<'div'>, EditAreaBaseProps {}

export const EditArea = forwardRef<HTMLDivElement, EditAreaProps>((props, ref) => {
  const editable = useEditContext()
  const mergedProps = mergeProps(editable.getAreaProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

EditArea.displayName = 'EditArea'
