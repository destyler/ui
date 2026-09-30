import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as radio from '@destyler/radio'
import { normalizeProps } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useNativeInputSync } from '~/hooks/use-native-input-sync'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

export interface UseRadioProps extends Optional<Omit<radio.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the radio group when it is first rendered.
   * Use when you do not need to control the state of the radio group.
   */
  defaultValue?: radio.Context['value']
}

export interface UseRadioReturn extends radio.Api<PropTypes> {}

export function useRadio(props: UseRadioProps = {}): UseRadioReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: radio.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...normalizeMachineProps(props),
  }

  const context: radio.Context = {
    ...initialContext,
    ...(props.value !== undefined ? { value: props.value } : {}),
    onValueChange: useEvent(props.onValueChange, { sync: true }),
  }

  const [state, send, service] = useMachine(radio.machine(initialContext), {
    context,
  })

  const syncInput = useNativeInputSync()
  const api = radio.connect(state, send, normalizeProps)
  return {
    ...api,
    getItemHiddenInputProps(props) {
      const inputProps = api.getItemHiddenInputProps(props)
      return {
        ...inputProps,
        onClick(event) {
          inputProps.onClick?.(event)
          const input = event.currentTarget
          syncInput(input, () => {
            // Selecting a radio also unchecks its sibling. Restore the entire
            // owned group, including inputs outside the root through a portal.
            const owner = input.getAttribute('data-ownedby')
            const root = input.getRootNode() as Document | ShadowRoot
            for (const sibling of Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"][data-ownedby]'))) {
              if (sibling.getAttribute('data-ownedby') === owner)
                sibling.checked = sibling.value === service.state.context.value
            }
          })
        },
      }
    },
  }
}
