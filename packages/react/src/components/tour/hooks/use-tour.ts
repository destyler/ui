import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as tour from '@destyler/tour'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseTourProps extends Optional<Omit<tour.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseTourReturn extends tour.Api<PropTypes> {}

export function useTour(props: UseTourProps = {}): UseTourReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: tour.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...props,
  }

  const context: tour.Context = {
    ...initialContext,
    onStatusChange: useEvent(props.onStatusChange),
  }

  const [state, send] = useMachine(tour.machine(initialContext), { context })
  return tour.connect(state, send, normalizeProps)
}
