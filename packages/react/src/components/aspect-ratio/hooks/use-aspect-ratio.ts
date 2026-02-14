import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEnvironmentContext } from '~/providers'

export interface UseAspectRatioProps
  extends Optional<Omit<aspectRatio.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial ratio of the aspect ratio component when it is first rendered.
   * Use when you do not need to control its ratio state.
   */
  defaultRatio?: aspectRatio.Context['ratio']
}

export interface UseAspectRatioReturn extends aspectRatio.Api<PropTypes> {}

export function useAspectRatio(props: UseAspectRatioProps = {}): UseAspectRatioReturn {
  const { getRootNode } = useEnvironmentContext()
  const id = useId()

  const initialContext: aspectRatio.Context = {
    id,
    getRootNode,
    ratio: props.defaultRatio ?? props.ratio,
    ...props,
  }

  const context: aspectRatio.Context = {
    ...initialContext,
    ratio: props.ratio ?? props.defaultRatio,
  }

  const [state, send] = useMachine(aspectRatio.machine(initialContext), { context })
  const api = aspectRatio.connect(state, send, normalizeProps)

  return api
}
