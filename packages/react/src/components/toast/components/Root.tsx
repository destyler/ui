import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastRootBaseProps extends PolymorphicProps {}
export interface ToastRootProps extends HTMLProps<'div'>, ToastRootBaseProps {}

export const ToastRoot = forwardRef<HTMLDivElement, ToastRootProps>((props, ref) => {
  const toast = useToastContext()
  const mergedProps = mergeProps(toast.getRootProps(), props)

  return (
    <ui.div {...mergedProps} ref={ref}>
      <ui.div {...toast.getGhostBeforeProps()} />
      {props.children}
      <ui.div {...toast.getGhostAfterProps()} />
    </ui.div>
  )
})

ToastRoot.displayName = 'ToastRoot'
