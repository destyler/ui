import type { ReactNode } from 'react'
import type { CreateToasterReturn } from '../hooks/create-toaster'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps, normalizeProps, useActor, useMachine } from '@destyler/react'
import * as toast from '@destyler/toast'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { ToastProvider } from '../hooks/use-toast-context'

export interface ToasterBaseProps extends PolymorphicProps {
  toaster: CreateToasterReturn
  children: (toast: toast.Options<ReactNode>) => ReactNode
}
export interface ToasterProps extends Assign<HTMLProps<'div'>, ToasterBaseProps> {}

export const Toaster = forwardRef<HTMLDivElement, ToasterProps>((props, ref) => {
  const { toaster, children, ...rest } = props
  const [state, send] = useMachine(toaster.machine)
  const placement = state.context.placement

  const api = toast.group.connect(state as toast.GroupState<ReactNode>, send, normalizeProps)
  const toasts = api.getToastsByPlacement(placement)

  const mergedProps = mergeProps(api.getGroupProps({ placement }), rest)

  return (
    <ui.div {...mergedProps} ref={ref}>
      {toasts.map(toast => (
        <ToastActor key={toast.id} value={toast}>
          {ctx => children(ctx)}
        </ToastActor>
      ))}
    </ui.div>
  )
})

Toaster.displayName = 'Toaster'

interface ToastActorProps {
  value: toast.Service
  children: (ctx: toast.Options<ReactNode>) => ReactNode
}

function ToastActor(props: ToastActorProps) {
  const [state, send] = useActor(props.value)
  const api = toast.connect(state, send, normalizeProps)
  return <ToastProvider value={api}>{props.children(state.context)}</ToastProvider>
}
