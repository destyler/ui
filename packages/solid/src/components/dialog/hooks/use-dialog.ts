import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseDialogProps
  extends Optional<Omit<dialog.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the dialog when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: dialog.Context['open']
}
export interface UseDialogReturn extends Accessor<dialog.Api<PropTypes>> {}

export function useDialog(props: UseDialogProps = {}): UseDialogReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    'dir': locale().dir,
    'getRootNode': environment().getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    ...props,
  }))
  const [state, send] = useMachine(dialog.machine(context()), { context })

  return createMemo(() => dialog.connect(state, send, normalizeProps))
}
