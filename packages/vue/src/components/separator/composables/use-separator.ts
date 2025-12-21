import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { Optional } from '~/types'
import * as separator from '@destyler/separator'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useEnvironmentContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseSeparatorProps
  extends Optional<Omit<separator.Context, 'getRootNode'>, 'id'> {}

export interface UseSeparatorReturn extends ComputedRef<separator.Api<PropTypes>> {}

export function useSeparator(props: UseSeparatorProps = {}): UseSeparatorReturn {
  const id = useId()
  const env = useEnvironmentContext()

  const context = computed<separator.Context>(() => ({
    id,
    getRootNode: env?.value.getRootNode,
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(separator.machine(context.value), { context })
  const api = computed(() => separator.connect(state.value, send, normalizeProps))

  return api
}
