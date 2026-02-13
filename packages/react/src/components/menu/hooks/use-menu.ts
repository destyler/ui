import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseMenuProps extends Optional<Omit<menu.Context, 'open.controlled' | 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial open state of the menu when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: menu.Context['open']
}
export interface UseMenuReturn {
  machine: menu.Service
  api: menu.Api<PropTypes>
}

export function useMenu(props: UseMenuProps = {}): UseMenuReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const id = useId()

  const onOpenChange = useEvent(props.onOpenChange, { sync: true })
  const onSelect = useEvent(props.onSelect)
  const onEscapeKeyDown = useEvent(props.onEscapeKeyDown)
  const onFocusOutside = useEvent(props.onFocusOutside)
  const onHighlightChange = useEvent(props.onHighlightChange)
  const onInteractOutside = useEvent(props.onInteractOutside)
  const onPointerDownOutside = useEvent(props.onPointerDownOutside)

  const initialContext: menu.Context = {
    'id': id,
    dir,
    getRootNode,
    'open': props.defaultOpen ?? props.open,
    'open.controlled': props.open !== undefined,
  }

  const context: menu.Context = {
    ...initialContext,
    open: props.open ?? props.defaultOpen,
    onOpenChange,
    onSelect,
    onEscapeKeyDown,
    onFocusOutside,
    onHighlightChange,
    onInteractOutside,
    onPointerDownOutside,
  }

  const [state, send, machine] = useMachine(menu.machine(initialContext), { context })
  const api = menu.connect(state, send, normalizeProps)

  return { api, machine }
}
