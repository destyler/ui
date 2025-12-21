import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { Optional } from '~/types'
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useEnvironmentContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseLabelProps
  extends Optional<Omit<label.Context, 'getRootNode'>, 'id'> {}

export interface UseLabelReturn extends ComputedRef<label.Api<PropTypes>> {}

export function useLabel(props: UseLabelProps = {}): UseLabelReturn {
  const id = useId()
  const env = useEnvironmentContext()

  const context = computed<label.Context>(() => ({
    id,
    getRootNode: env?.value.getRootNode,
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(label.machine(context.value), { context })
  const api = computed(() => label.connect(state.value, send, normalizeProps))

  return api
}
