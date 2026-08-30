import type { Accessor, JSX } from 'solid-js'
import type { CreateToasterReturn } from '../hooks/create-toaster'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps, normalizeProps, useActor, useMachine } from '@destyler/solid'
import * as toast from '@destyler/toast'
import { createMemo, For, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { ToastProvider } from '../hooks/use-toast-context'

export interface ToasterBaseProps extends PolymorphicProps<'div'> {
  toaster: CreateToasterReturn
  children: (toast: Accessor<toast.Options<JSX.Element>>) => JSX.Element
}
export interface ToasterProps extends Assign<HTMLProps<'div'>, ToasterBaseProps> {}

export function Toaster(props: ToasterProps) {
  const [toasterProps, localProps] = splitProps(props, ['toaster', 'children'])
  const [state, send] = useMachine(toasterProps.toaster.machine)
  const placement = state.context.placement

  const api = createMemo(() =>
    toast.group.connect(state as toast.GroupState<JSX.Element>, send, normalizeProps))
  const toasts = createMemo(() => api().getToastsByPlacement(placement))

  const mergedProps = mergeProps(api().getGroupProps({ placement }), localProps)

  return (
    <ui.div {...mergedProps}>
      <For each={toasts()}>
        {toast => <ToastActor value={toast}>{ctx => toasterProps.children(ctx)}</ToastActor>}
      </For>
    </ui.div>
  )
}

interface ToastActorProps {
  value: toast.Service
  children: (ctx: Accessor<toast.Options<JSX.Element>>) => JSX.Element
}

function ToastActor(props: ToastActorProps) {
  const [state, send] = useActor(props.value)
  const api = createMemo(() => toast.connect(state, send, normalizeProps))
  const ctx = createMemo(() => state.context)
  return <ToastProvider value={api}>{props.children(ctx)}</ToastProvider>
}
