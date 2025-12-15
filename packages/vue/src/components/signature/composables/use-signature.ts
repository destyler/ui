import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as signature from '@destyler/signature'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseSignatureProps extends Optional<Omit<signature.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseSignatureReturn extends ComputedRef<signature.Api<PropTypes>> {}

export function useSignature(props: UseSignatureProps = {}, emit?: EmitFn<RootEmits>): UseSignatureReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()

  const context = computed<signature.Context>(() => ({
    id,
    ids: {
      label: field?.value.ids.label,
      hiddenInput: field?.value.ids.control,
    },
    disabled: field?.value.disabled,
    readOnly: field?.value.readOnly,
    required: field?.value.required,
    dir: locale.value.dir,
    getRootNode: env?.value.getRootNode,
    onDraw: details => emit?.('draw', details),
    onDrawEnd: details => emit?.('drawEnd', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(signature.machine(context.value), { context })
  return computed(() => signature.connect(state.value, send, normalizeProps))
}
