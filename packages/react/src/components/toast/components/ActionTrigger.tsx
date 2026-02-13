import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastActionTriggerBaseProps extends PolymorphicProps {}
export interface ToastActionTriggerProps extends HTMLProps<'button'>, ToastActionTriggerBaseProps {}

export const ToastActionTrigger = forwardRef<HTMLButtonElement, ToastActionTriggerProps>((props, ref) => {
  const toast = useToastContext()
  const mergedProps = mergeProps(toast.getActionTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

ToastActionTrigger.displayName = 'ToastActionTrigger'
