import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as tooltip from '@destyler/tooltip'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseTooltipProps
  extends Optional<Omit<tooltip.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the tooltip when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: tooltip.Context['open']
}

export interface UseTooltipReturn extends ComputedRef<tooltip.Api<PropTypes>> {}

export function useTooltip(props: UseTooltipProps = {}, emit?: EmitFn<RootEmits>): UseTooltipReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<tooltip.Context>(() => ({
    id,
    'dir': locale.value.dir,
    'getRootNode': env?.value.getRootNode,
    'open': props.open ?? props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'onOpenChange': (details) => {
      emit?.('openChange', details)
      emit?.('update:open', details.open)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(tooltip.machine(context.value), { context })

  return computed(() => tooltip.connect(state.value, send, normalizeProps))
}
