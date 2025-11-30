import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useEnvironmentContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseClipboardProps extends Optional<Omit<clipboard.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseClipboardReturn extends ComputedRef<clipboard.Api<PropTypes>> {}

export function useClipboard(props: UseClipboardProps = {}, emit?: EmitFn<RootEmits>): UseClipboardReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const context = computed<clipboard.Context>(() => ({
    id,
    getRootNode: env?.value.getRootNode,
    onStatusChange: details => emit?.('statusChange', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(clipboard.machine(context.value), { context })
  return computed(() => clipboard.connect(state.value, send, normalizeProps))
}
