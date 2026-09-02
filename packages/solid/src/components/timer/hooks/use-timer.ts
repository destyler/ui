import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as timer from '@destyler/timer'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext } from '~/providers'

export interface UseTimerProps extends Optional<Omit<timer.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseTimerReturn extends Accessor<timer.Api<PropTypes>> {}

export function useTimer(props: UseTimerProps = {}): UseTimerReturn {
  const env = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    getRootNode: env().getRootNode,
    ...props,
  }))

  const [state, send] = useMachine(timer.machine(context()), { context })

  return createMemo(() => timer.connect(state, send, normalizeProps))
}
