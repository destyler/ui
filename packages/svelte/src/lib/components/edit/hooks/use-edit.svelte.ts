import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as edit from '@destyler/edit'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseEditProps
  extends Omit<edit.Context, 'dir' | 'getRootNode' | 'edit.controlled' | 'id'> {
  id: string
  defaultEdit?: edit.Context['edit']
  defaultValue?: edit.Context['value']
}
export interface UseEditReturn extends Accessor<edit.Api<PropTypes>> {}

export function useEdit(props: MaybeFunction<UseEditProps>): UseEditReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props) || {}
    return createMachineProps({
      getRootNode: env().getRootNode,
      dir: locale().dir,
      ids: {
        label: field?.()?.ids.label,
        input: field?.()?.ids.control,
      },
      disabled: field?.()?.disabled,
      invalid: field?.()?.invalid,
      readOnly: field?.()?.readOnly,
      required: field?.()?.required,
      ...resolvedProps,
    }, { edit: 'defaultEdit', value: 'defaultValue' }, ['edit'])
  })

  const [state, send] = useMachine(() => edit.machine(machineProps.initial as edit.Context), {
    get context() {
      return machineProps.context as edit.Context
    },
  })
  const api = $derived(edit.connect(state, send, normalizeProps))

  return () => api
}
