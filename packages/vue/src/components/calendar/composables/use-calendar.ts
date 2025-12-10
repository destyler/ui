import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as calendar from '@destyler/calendar'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseCalendarProps
  extends Optional<Omit<calendar.Context, 'dir' | 'getRootNode' | 'parse' | 'open.controlled' | 'value'>, 'id'> {
  /**
   * The v-model value of the calendar
   */
  modelValue?: calendar.Context['value']
  /**
   * The initial open state of the calendar when it is first rendered.
   */
  defaultOpen?: calendar.Context['open']
  /**
   * The initial value of the calendar when it is first rendered.
   */
  defaultValue?: calendar.Context['value']
  /**
   * The initial view of the calendar when it is first rendered.
   */
  defaultView?: calendar.Context['view']
}

export interface UseCalendarReturn extends ComputedRef<calendar.Api<PropTypes>> {}

export function useCalendar(props: UseCalendarProps = {}, emit?: EmitFn<RootEmits>): UseCalendarReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const context = computed<calendar.Context>(() => {
    return {
      id,
      'dir': locale.value.dir,
      'open': props.open ?? props.defaultOpen,
      'open.controlled': props.open !== undefined,
      'value': props.defaultValue ?? props.modelValue,
      'view': props.defaultView ?? props.view,
      'getRootNode': env?.value.getRootNode,
      'onFocusChange': details => emit?.('focusChange', details),
      'onViewChange': (details) => {
        emit?.('viewChange', details)
        emit?.('update:view', details.view)
      },
      'onOpenChange': (details) => {
        emit?.('openChange', details)
        emit?.('update:open', details.open)
      },
      'onValueChange': (details) => {
        emit?.('valueChange', details)
        emit?.('update:modelValue', details.value)
      },
      ...cleanProps(props),
    }
  })

  const [state, send] = useMachine(calendar.machine(context.value), {
    context,
  })

  return computed(() => calendar.connect(state.value, send, normalizeProps))
}
