import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { Optional } from '~/types'
import * as aspectRatio from '@destyler/aspect-ratio'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useEnvironmentContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseAspectRatioProps
  extends Optional<Omit<aspectRatio.Context, 'getRootNode'>, 'id'> {}

export interface UseAspectRatioReturn extends ComputedRef<aspectRatio.Api<PropTypes>> {}

export function useAspectRatio(props: UseAspectRatioProps = {}): UseAspectRatioReturn {
  const id = useId()
  const env = useEnvironmentContext()

  const context = computed<aspectRatio.Context>(() => ({
    id,
    getRootNode: env?.value.getRootNode,
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(aspectRatio.machine(context.value), { context })
  const api = computed(() => aspectRatio.connect(state.value, send, normalizeProps))

  return api
}
