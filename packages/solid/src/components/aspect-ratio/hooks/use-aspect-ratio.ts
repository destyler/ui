import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseAspectRatioProps
  extends Optional<Omit<aspectRatio.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseAspectRatioReturn extends Accessor<aspectRatio.Api<PropTypes>> {}

export function useAspectRatio(props: UseAspectRatioProps = {}): UseAspectRatioReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const initialContext = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    ...(props.ratio !== undefined ? { ratio: props.ratio } : {}),
  }))

  const [state, send] = useMachine(aspectRatio.machine(initialContext()), { context })

  return createMemo(() => aspectRatio.connect(state, send, normalizeProps))
}
