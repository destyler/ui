import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastCloseTriggerBaseProps extends PolymorphicProps {}
export interface ToastCloseTriggerProps extends HTMLProps<'button'>, ToastCloseTriggerBaseProps {}

export const ToastCloseTrigger = forwardRef<HTMLButtonElement, ToastCloseTriggerProps>((props, ref) => {
  const toast = useToastContext()
  const mergedProps = mergeProps(toast.getCloseTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

ToastCloseTrigger.displayName = 'ToastCloseTrigger'
