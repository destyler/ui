import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseDialogProps
  extends Optional<Omit<dialog.Context, 'getRootNode' | 'dir' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the dialog when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: dialog.Context['open']
}

export interface UseDialogReturn extends dialog.Api<PropTypes> {}

export function useDialog(props: UseDialogProps = {}): UseDialogReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: dialog.Context = {
    'id': useId(),
    getRootNode,
    dir,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    ...props,
  }

  const context: dialog.Context = {
    ...initialContext,
    open: props.open,
    onOpenChange: useEvent(props.onOpenChange, { sync: true }),
    onEscapeKeyDown: useEvent(props.onEscapeKeyDown),
    onInteractOutside: useEvent(props.onInteractOutside),
  }

  const [state, send] = useMachine(dialog.machine(initialContext), { context })
  return dialog.connect(state, send, normalizeProps)
}
