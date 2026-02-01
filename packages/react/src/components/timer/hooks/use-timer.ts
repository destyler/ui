import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as timer from '@destyler/timer'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext } from '~/providers'

export interface UseTimerProps extends Optional<Omit<timer.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseTimerReturn extends timer.Api<PropTypes> {}

export function useTimer(props: UseTimerProps = {}): UseTimerReturn {
  const env = useEnvironmentContext()

  const initialContext: timer.Context = {
    id: useId(),
    getRootNode: env.getRootNode,
    ...props,
  }

  const context: timer.Context = {
    ...initialContext,
    onComplete: useEvent(props.onComplete),
    onTick: useEvent(props.onTick),
  }

  const [state, send] = useMachine(timer.machine(initialContext), { context })

  return timer.connect(state, send, normalizeProps)
}
