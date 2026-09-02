import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as checkbox from '@destyler/checkbox'
import { mergeProps, normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { useCheckboxGroupContext } from './use-checkbox-group-context'

export interface UseCheckboxProps
  extends Optional<Omit<checkbox.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The checked state of the checkbox when it is first rendered.
   * Use this when you do not need to control the state of the checkbox.
   */
  defaultChecked?: checkbox.Context['checked']
}
export interface UseCheckboxReturn extends Accessor<checkbox.Api<PropTypes>> {}

export function useCheckbox(ownProps: UseCheckboxProps = {}): UseCheckboxReturn {
  const checkboxGroup = useCheckboxGroupContext()

  const props = createMemo(() => {
    return mergeProps(ownProps, checkboxGroup?.().getItemProps({ value: ownProps.value }) ?? {})
  }, [ownProps, checkboxGroup])

  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()
  const field = useFieldContext()

  const initialContext = createMemo(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    disabled: field?.().disabled,
    readOnly: field?.().readOnly,
    invalid: field?.().invalid,
    required: field?.().required,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    checked: props().defaultChecked,
    ...props(),
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    checked: props().checked,
  }))

  const [state, send] = useMachine(checkbox.machine(initialContext()), { context })

  return createMemo(() => checkbox.connect(state, send, normalizeProps))
}
