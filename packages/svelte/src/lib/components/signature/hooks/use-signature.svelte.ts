import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as signature from '@destyler/signature'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseSignatureProps extends Omit<signature.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}
export interface UseSignatureReturn extends Accessor<signature.Api<PropTypes>> {}

export function useSignature(props: MaybeFunction<UseSignatureProps>) {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ids: {
        label: field?.().ids.label,
        hiddenInput: field?.().ids.control,
      },
      disabled: field?.().disabled,
      readOnly: field?.().readOnly,
      required: field?.().required,
      ...resolvedProps,
    }
  })

  const [state, send] = useMachine(() => signature.machine(machineProps as signature.Context), {
    get context() {
      return machineProps as signature.Context
    },
  })
  const api = $derived(signature.connect(state, send, normalizeProps))

  return () => api
}
