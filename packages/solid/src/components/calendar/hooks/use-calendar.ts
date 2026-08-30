import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as calendar from '@destyler/calendar'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseCalendarProps
  extends Optional<Omit<calendar.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the date picker when it is first rendered.
   */
  defaultOpen?: calendar.Context['open']
  /**
   * The initial value of the date picker when it is first rendered.
   */
  defaultValue?: calendar.Context['value']
  /**
   * The initial view of the date picker when it is first rendered.
   */
  defaultView?: calendar.Context['view']
}
export interface UseCalendarReturn extends Accessor<calendar.Api<PropTypes>> {}

export function useCalendar(props: UseCalendarProps = {}): UseCalendarReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    'dir': locale().dir,
    'getRootNode': environment().getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'value': props.defaultValue,
    'view': props.defaultView,
    ...props,
  }))

  const [state, send] = useMachine(calendar.machine(context()), { context })

  return createMemo(() => calendar.connect(state, send, normalizeProps))
}
