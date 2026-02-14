import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditControlBaseProps extends PolymorphicProps {}
export interface EditControlProps extends HTMLProps<'div'>, EditControlBaseProps {}

export const EditControl = forwardRef<HTMLDivElement, EditControlProps>((props, ref) => {
  const editable = useEditContext()
  const mergedProps = mergeProps(editable.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

EditControl.displayName = 'EditControl'
