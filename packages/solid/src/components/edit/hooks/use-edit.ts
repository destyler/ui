import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseEditProps
  extends Optional<Omit<edit.Context, 'dir' | 'getRootNode' | 'edit.controlled'>, 'id'> {
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

  const context = createMemo(() => ({
    id,
    'ids': {
      label: field?.().ids.label,
      input: field?.().ids.control,
    },
    'dir': locale().dir,
    'disabled': field?.().disabled,
    'invalid': field?.().invalid,
    'readOnly': field?.().readOnly,
    'required': field?.().required,
    'getRootNode': environment().getRootNode,
    'edit': props.defaultEdit,
    'value': props.defaultValue,
    'edit.controlled': props.edit !== undefined,
    ...props,
  }))
  const [state, send] = useMachine(edit.machine(context()), { context })

  return createMemo(() => edit.connect(state, send, normalizeProps))
}
