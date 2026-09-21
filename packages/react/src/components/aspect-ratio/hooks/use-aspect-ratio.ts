import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEnvironmentContext } from '~/providers'

export interface UseAspectRatioProps
  extends Optional<Omit<aspectRatio.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseAspectRatioReturn extends aspectRatio.Api<PropTypes> {}

export function useAspectRatio(props: UseAspectRatioProps = {}): UseAspectRatioReturn {
  const { getRootNode } = useEnvironmentContext()
  const id = useId()

  const initialContext: aspectRatio.Context = {
    id,
    getRootNode,
    ...props,
  }

  const context: aspectRatio.Context = {
    ...initialContext,
    ...(props.ratio !== undefined ? { ratio: props.ratio } : {}),
  }

  const [state, send] = useMachine(aspectRatio.machine(initialContext), { context })
  const api = aspectRatio.connect(state, send, normalizeProps)

  return api
}
