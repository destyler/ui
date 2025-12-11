import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseHoverCardProps
  extends Optional<Omit<hoverCard.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the hover card when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: hoverCard.Context['open']
}
export interface UseHoverCardReturn extends ComputedRef<hoverCard.Api<PropTypes>> {}

export function useHoverCard(props: UseHoverCardProps = {}, emit?: EmitFn<RootEmits>): UseHoverCardReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const context = computed<hoverCard.Context>(() => ({
    id,
    'dir': locale.value.dir,
    'open': props.open ?? props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'getRootNode': env?.value.getRootNode,
    'onOpenChange': (details) => {
      emit?.('openChange', details)
      emit?.('update:open', details.open)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(hoverCard.machine(context.value), { context })

  return computed(() => hoverCard.connect(state.value, send, normalizeProps))
}
