import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastTitleBaseProps extends PolymorphicProps {}
export interface ToastTitleProps extends HTMLProps<'div'>, ToastTitleBaseProps {}

export const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>((props, ref) => {
  const toast = useToastContext()
  const mergedProps = mergeProps(toast.getTitleProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ToastTitle.displayName = 'ToastTitle'
