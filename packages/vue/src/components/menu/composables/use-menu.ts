import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { EmitFn, Optional } from '~/types'
import * as menu from '@destyler/menu'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseMenuProps extends Optional<Omit<menu.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the menu when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: menu.Context['open']
}

export interface UseMenuReturn {
  api: ComputedRef<menu.Api<PropTypes>>
  machine: menu.Service
}

export function useMenu(props: UseMenuProps = {}, emit?: EmitFn<RootEmits>): UseMenuReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<menu.Context>(() => ({
    id,
    'dir': locale.value.dir,
    'open': props.open ?? props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'getRootNode': env?.value.getRootNode,
    'onOpenChange': (details) => {
      emit?.('openChange', details)
      emit?.('update:open', details.open)
    },
    'onEscapeKeyDown': details => emit?.('escapeKeyDown', details),
    'onFocusOutside': details => emit?.('focusOutside', details),
    'onHighlightChange': details => emit?.('highlightChange', details),
    'onInteractOutside': details => emit?.('interactOutside', details),
    'onPointerDownOutside': details => emit?.('pointerDownOutside', details),
    'onSelect': details => emit?.('select', details),
    ...cleanProps(props),
  }))

  const [state, send, machine] = useMachine(menu.machine(context.value), { context })
  const api = computed(() => menu.connect(state.value, send, normalizeProps))

  return {
    api,
    machine,
  }
}
