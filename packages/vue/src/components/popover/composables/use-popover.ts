import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UsePopoverProps
  extends Optional<Omit<popover.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the popover when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: popover.Context['open']
}

export interface UsePopoverReturn extends ComputedRef<popover.Api<PropTypes>> {}

export function usePopover(props: UsePopoverProps = {}, emit?: EmitFn<RootEmits>) {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<popover.Context>(() => ({
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
    'onInteractOutside': details => emit?.('interactOutside', details),
    'onPointerDownOutside': details => emit?.('pointerDownOutside', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(popover.machine(context.value), { context })

  return computed(() => popover.connect(state.value, send, normalizeProps))
}
