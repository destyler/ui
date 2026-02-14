import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditLabelBaseProps extends PolymorphicProps {}
export interface EditLabelProps extends HTMLProps<'label'>, EditLabelBaseProps {}

export const EditLabel = forwardRef<HTMLLabelElement, EditLabelProps>((props, ref) => {
  const editable = useEditContext()
  const mergedProps = mergeProps(editable.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

EditLabel.displayName = 'EditLabel'
