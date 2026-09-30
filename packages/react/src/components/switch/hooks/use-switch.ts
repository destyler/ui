import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps } from '@destyler/react'
import * as zagSwitch from '@destyler/switch'
import { useId } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useNativeInputSync } from '~/hooks/use-native-input-sync'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseSwitchProps extends Optional<Omit<zagSwitch.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The checked state of the switch when it is first rendered.
   * Use this when you do not need to control the state of the switch.
   */
  defaultChecked?: zagSwitch.Context['checked']
}

export interface UseSwitchReturn extends zagSwitch.Api<PropTypes> {}

export function useSwitch(props: UseSwitchProps = {}): UseSwitchReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const field = useFieldContext()

  const initialContext: zagSwitch.Context = {
    id: useId(),
    ids: {
      label: field?.ids.label,
      hiddenInput: field?.ids.control,
    },
    dir,
    disabled: field?.disabled,
    readOnly: field?.readOnly,
    invalid: field?.invalid,
    required: field?.required,
    getRootNode,
    ...normalizeMachineProps(props),
  }

  const context: zagSwitch.Context = {
    ...initialContext,
    ...(props.checked !== undefined ? { checked: props.checked } : {}),
    onCheckedChange: useEvent(props.onCheckedChange, { sync: true }),
  }

  const [state, send, service] = useMachine(zagSwitch.machine(initialContext), { context })

  const syncInput = useNativeInputSync()
  const api = zagSwitch.connect(state, send, normalizeProps)
  return {
    ...api,
    getHiddenInputProps() {
      const inputProps = api.getHiddenInputProps()
      return {
        ...inputProps,
        onClick(event) {
          inputProps.onClick?.(event)
          const input = event.currentTarget
          syncInput(input, () => {
            const context = service.state.context
            input.checked = !!context.checked
          })
        },
      }
    },
  }
}
