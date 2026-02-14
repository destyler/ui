import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditSubmitTriggerBaseProps extends PolymorphicProps {}
export interface EditSubmitTriggerProps extends HTMLProps<'button'>, EditSubmitTriggerBaseProps {}

export const EditSubmitTrigger = forwardRef<HTMLButtonElement, EditSubmitTriggerProps>((props, ref) => {
  const editable = useEditContext()
  const mergedProps = mergeProps(editable.getSubmitTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

EditSubmitTrigger.displayName = 'EditSubmitTrigger'
