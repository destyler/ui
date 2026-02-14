import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditEditTriggerBaseProps extends PolymorphicProps {}
export interface EditEditTriggerProps extends HTMLProps<'button'>, EditEditTriggerBaseProps {}

export const EditEditTrigger = forwardRef<HTMLButtonElement, EditEditTriggerProps>((props, ref) => {
  const editable = useEditContext()
  const mergedProps = mergeProps(editable.getEditTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

EditEditTrigger.displayName = 'EditEditTrigger'
