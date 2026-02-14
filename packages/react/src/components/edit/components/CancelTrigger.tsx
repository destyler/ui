import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditCancelTriggerBaseProps extends PolymorphicProps {}
export interface EditCancelTriggerProps extends HTMLProps<'button'>, EditCancelTriggerBaseProps {}

export const EditCancelTrigger = forwardRef<HTMLButtonElement, EditCancelTriggerProps>((props, ref) => {
  const editable = useEditContext()
  const mergedProps = mergeProps(editable.getCancelTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

EditCancelTrigger.displayName = 'EditCancelTrigger'
