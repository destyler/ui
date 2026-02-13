import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastDescriptionBaseProps extends PolymorphicProps {}
export interface ToastDescriptionProps extends HTMLProps<'div'>, ToastDescriptionBaseProps {}

export const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>((props, ref) => {
  const toast = useToastContext()
  const mergedProps = mergeProps(toast.getDescriptionProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ToastDescription.displayName = 'ToastDescription'
