import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useControllableState } from '~/hooks/use-controllable-state'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { resolveMachineProps } from '~/utils/resolve-machine-props'

export interface UseEditProps
  extends Optional<Omit<edit.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial edit state of the edit when it is first rendered.
   * Use when you do not need to control its edit state.
   */
  defaultEdit?: edit.Context['edit']
  /**
   * The initial value of the edit when it is first rendered.
   * Use when you do not need to control the state of the edit.
   */
  defaultValue?: edit.Context['value']
}
export interface UseEditReturn extends Accessor<edit.Api<PropTypes>> {}

export function useEdit(props: UseEditProps = {}) {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()
  const field = useFieldContext()
  // Core has no defaultEdit. The UI owns this initial-only state and bridges
  // requests back into core, while explicit edit still requires parent writeback.
  const [editing, setEditing] = useControllableState<boolean>({
    value: () => props.edit,
    defaultValue: () => props.defaultEdit ?? false,
    onChange: edit => props.onEditChange?.({ edit }),
  })

  const initialContext = createMemo(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      input: field?.().ids.control,
    },
    dir: locale().dir,
    disabled: field?.().disabled,
    invalid: field?.().invalid,
    readOnly: field?.().readOnly,
    required: field?.().required,
    getRootNode: environment().getRootNode,
    ...resolveMachineProps(props, ['defaultEdit']),
    edit: editing(),
    onEditChange: (details: edit.EditChangeDetails) => setEditing(details.edit),
  }))
  const context = createMemo(() => ({
    ...initialContext(),
    ...(props.value !== undefined ? { value: props.value } : {}),
  }))
  const [state, send] = useMachine(edit.machine(initialContext()), { context })

  return createMemo(() => edit.connect(state, send, normalizeProps))
}
