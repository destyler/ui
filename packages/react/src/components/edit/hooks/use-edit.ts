import type { PropTypes } from '@destyler/types'
import type { Optional } from '~/types'
import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseEditProps
  extends Optional<Omit<edit.Context, 'dir' | 'getRootNode' | 'edit.controlled'>, 'id'> {
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

  const initialContext: edit.Context = {
    'id': useId(),
    'ids': {
      label: field?.ids.label,
      input: field?.ids.control,
    },
    dir,
    'disabled': field?.disabled,
    'invalid': field?.invalid,
    'readOnly': field?.readOnly,
    'required': field?.required,
    getRootNode,
    'edit': props.defaultEdit,
    'value': props.defaultValue,
    'edit.controlled': props.edit !== undefined,
    ...props,
  }

  const context: edit.Context = {
    ...initialContext,
    value: props.value,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onEditChange: useEvent(props.onEditChange),
    onValueCommit: useEvent(props.onValueCommit),
    onValueRevert: useEvent(props.onValueRevert),
  }

  const [state, send] = useMachine(edit.machine(initialContext), { context })
  return edit.connect(state, send, normalizeProps)
}
