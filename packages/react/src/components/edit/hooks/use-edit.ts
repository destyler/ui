import type { PropTypes } from '@destyler/types'
import type { Optional } from '~/types'
import * as edit from '@destyler/edit'
import { normalizeProps } from '@destyler/react'
import { useId, useRef } from 'react'
import { useFieldContext } from '~/components/field'
import { useControllableState } from '~/hooks/use-controllable-state'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useNativeInputValueSync } from '~/hooks/use-native-input-sync'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseEditProps
  extends Optional<Omit<edit.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial edit state of the editable when it is first rendered.
   * Use when you do not need to control its edit state.
   */
  defaultEdit?: edit.Context['edit']
  /**
   * The initial value of the editable when it is first rendered.
   * Use when you do not need to control the state of the editable.
   */
  defaultValue?: edit.Context['value']
}

export interface UseEditReturn extends edit.Api<PropTypes> {}

export function useEdit(props: UseEditProps = {}): UseEditReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const field = useFieldContext()
  const { defaultEdit, edit: editProp, ...editProps } = props

  // Core has no defaultEdit. The UI owns this state and writes every edit
  // request back, while an explicit edit prop still lets the parent veto it.
  const [editing, setEditing] = useControllableState({
    value: editProp,
    defaultValue: defaultEdit ?? false,
    onChange: edit => props.onEditChange?.({ edit }),
  })

  const initialContext: edit.Context = {
    id: useId(),
    ids: {
      label: field?.ids.label,
      input: field?.ids.control,
    },
    dir,
    disabled: field?.disabled,
    invalid: field?.invalid,
    readOnly: field?.readOnly,
    required: field?.required,
    getRootNode,
    ...normalizeMachineProps(editProps),
    edit: editing,
  }

  const context: edit.Context = {
    ...initialContext,
    ...(props.value !== undefined ? { value: props.value } : {}),
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onEditChange: useEvent(details => setEditing(details.edit), { sync: true }),
    onValueCommit: useEvent(props.onValueCommit),
    onValueRevert: useEvent(props.onValueRevert),
  }

  const composing = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const machine = edit.machine(initialContext)
  const syncCoreInput = machine.options.actions?.syncInputValue
  const [state, send, service] = useMachine(machine, {
    context,
    actions: {
      syncInputValue(context, event, meta) {
        // Parent writeback must not replace text while the IME owns this input.
        if (!composing.current?.isConnected)
          syncCoreInput?.(context, event, meta)
      },
    },
  })
  const syncInputProps = useNativeInputValueSync(() => service.state.context.value, composing)
  const api = edit.connect(state, send, normalizeProps)
  return {
    ...api,
    getInputProps() {
      return syncInputProps(api.getInputProps(), 'onChange')
    },
  }
}
