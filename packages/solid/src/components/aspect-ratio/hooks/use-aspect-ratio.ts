import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseAspectRatioProps
  extends Optional<Omit<aspectRatio.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial ratio of the aspect ratio component when it is first rendered.
   * Use when you do not need to control its ratio state.
   */
  defaultRatio?: aspectRatio.Context['ratio']
}

export interface UseAspectRatioReturn extends Accessor<aspectRatio.Api<PropTypes>> {}

export function useAspectRatio(props: UseAspectRatioProps = {}): UseAspectRatioReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ratio: props.defaultRatio,
    ...props,
  }))

  const [state, send] = useMachine(aspectRatio.machine(context()), { context })

  return createMemo(() => aspectRatio.connect(state, send, normalizeProps))
}
