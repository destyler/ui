import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as zagSwitch from '@destyler/switch'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSwitchProps
  extends Optional<Omit<zagSwitch.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The checked state of the switch when it is first rendered.
   * Use this when you do not need to control the state of the switch.
   */
  defaultChecked?: zagSwitch.Context['checked']
}
export interface UseSwitchReturn extends Accessor<zagSwitch.Api<PropTypes>> {}

export function useSwitch(props: UseSwitchProps = {}): UseSwitchReturn {
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
    checked: props.defaultChecked,
    ...props,
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    checked: props.checked,
  }))

  const [state, send] = useMachine(zagSwitch.machine(initialContext()), { context })

  return createMemo(() => zagSwitch.connect(state, send, normalizeProps))
}
