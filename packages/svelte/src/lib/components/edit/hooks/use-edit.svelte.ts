import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import { createInputValueSync } from '$lib/utils/sync-input-value'
import * as edit from '@destyler/edit'
import { mergeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'
import { untrack } from 'svelte'
import { useFieldContext } from '../../field'

export interface UseEditProps
  extends Omit<edit.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultEdit?: edit.Context['edit']
  defaultValue?: edit.Context['value']
}
export interface UseEditReturn extends Accessor<edit.Api<PropTypes>> {}

export function useEdit(props: MaybeFunction<UseEditProps>): UseEditReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()
  // Core has no defaultEdit. The UI owns this state and writes edit requests back
  // to core, while an explicit live edit prop remains owned by the caller.
  let localEdit = $state(untrack(() => runIfFn(props).defaultEdit ?? false))

  const machineProps = $derived.by(() => {
    const { defaultEdit: _defaultEdit, edit: liveEdit, onEditChange, ...resolvedProps } = runIfFn(props)
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
      edit: liveEdit !== undefined ? liveEdit : localEdit,
      onEditChange(details: edit.EditChangeDetails) {
        if (liveEdit === undefined)
          localEdit = details.edit
        onEditChange?.(details)
      },
    }, { value: 'defaultValue' })
  })

  const [state, send] = useMachine(() => edit.machine(machineProps.initial as edit.Context), {
    get context() {
      return machineProps.context as edit.Context
    },
  })
  const connected = $derived(edit.connect(state, send, normalizeProps))
  const syncInputValue = createInputValueSync(() => connected.getInputProps(), () => connected.value)
  const api = $derived({
    ...connected,
    getInputProps() {
      return mergeProps(connected.getInputProps(), {
        oninput: syncInputValue,
        oncompositionend: syncInputValue,
      })
    },
  })

  return () => api
}
