import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as calendar from '@destyler/calendar'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseCalendarProps
  extends Optional<Omit<calendar.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
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

export interface UseCalendarReturn extends calendar.Api<PropTypes> {}

export function useCalendar(props: UseCalendarProps = {}): UseCalendarReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: calendar.Context = {
    'id': useId(),
    dir,
    getRootNode,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'value': props.defaultValue,
    'view': props.defaultView,
    ...props,
  }

  const context: calendar.Context = {
    ...initialContext,
    value: props.value,
    view: props.view,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onFocusChange: useEvent(props.onFocusChange),
    onViewChange: useEvent(props.onViewChange),
    onOpenChange: useEvent(props.onOpenChange),
  }

  const [state, send] = useMachine(calendar.machine(initialContext), {
    context,
  })
  return calendar.connect(state, send, normalizeProps)
}
