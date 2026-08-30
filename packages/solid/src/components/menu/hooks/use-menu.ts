import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseMenuProps
  extends Optional<Omit<menu.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the menu when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: menu.Context['open']
}

export interface UseMenuReturn {
  machine: menu.Service
  api: Accessor<menu.Api<PropTypes>>
}

export function useMenu(props: UseMenuProps = {}): UseMenuReturn {
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

  const [state, send, machine] = useMachine(menu.machine(context()), { context })
  const api = createMemo(() => menu.connect(state, send, normalizeProps))

  return {
    api,
    machine,
  }
}
