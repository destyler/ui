import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as calendar from '@destyler/calendar'
import { normalizeProps } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseCalendarProps
  extends Optional<Omit<calendar.Context, 'dir' | 'getRootNode'>, 'id'> {
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

  const { defaultView, ...calendarProps } = props
  const context: calendar.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...normalizeMachineProps(calendarProps),
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onFocusChange: useEvent(props.onFocusChange),
    onViewChange: useEvent(props.onViewChange),
    onOpenChange: useEvent(props.onOpenChange),
  }

  // defaultView is a UI-only seed; never synchronize it back after construction.
  const initialContext: calendar.Context = {
    ...context,
    ...(props.view === undefined && defaultView !== undefined ? { view: defaultView } : {}),
  }

  const [state, send] = useMachine(calendar.machine(initialContext), {
    context,
  })
  return calendar.connect(state, send, normalizeProps)
}
