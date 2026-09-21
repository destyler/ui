import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseProgressProps extends Optional<Omit<progress.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the progress when it is first rendered.
   * Use when you do not need to control the state of the progress.
   */
  defaultValue?: progress.Context['value']
}

export interface UseProgressReturn extends progress.Api<PropTypes> {}

export function useProgress(props: UseProgressProps = {}): UseProgressReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const { defaultValue, value, onValueChange, ...rest } = props

  // @destyler/progress@0.2.7 has no controllable defaultValue — seed initial only.
  const initialContext: progress.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...rest,
    ...(value !== undefined
      ? { value }
      : defaultValue !== undefined
        ? { value: defaultValue }
        : {}),
  }

  const context: progress.Context = {
    id: initialContext.id,
    dir,
    getRootNode,
    ...rest,
    ...(value !== undefined ? { value } : {}),
    onValueChange: useEvent(onValueChange, { sync: true }),
  }

  const [state, send] = useMachine(progress.machine(initialContext), { context })
  return progress.connect(state, send, normalizeProps)
}
