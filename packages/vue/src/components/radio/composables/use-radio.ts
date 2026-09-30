import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'
import { reconcileNativeInput } from '~/utils/reconcile-native-input'

export interface UseRadioProps extends Optional<Omit<radio.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial value of the radio when it is first rendered.
   * Use when you do not need to control the state of the radio.
   */
  defaultValue?: radio.Context['value']
  modelValue?: radio.Context['value']
}
export interface UseRadioReturn extends ComputedRef<radio.Api<PropTypes>> {}

export function useRadio(props: UseRadioProps = {}, emit?: EmitFn<RootEmits>): UseRadioReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const context = computed<radio.Context>(() => ({
    id,
    dir: locale.value.dir,
    ...(props.modelValue !== undefined ? { value: props.modelValue } : {}),
    getRootNode: env?.value.getRootNode,
    onValueChange: (details) => {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(radio.machine(context.value), { context })

  return computed(() => {
    const api = radio.connect(state.value, send, normalizeProps)
    return {
      ...api,
      getItemHiddenInputProps(itemProps) {
        return reconcileNativeInput(api.getItemHiddenInputProps(itemProps), (input) => {
          // Follow the machine's accepted value even after a live prop is
          // removed; ownership is determined when the machine is created.
          const value = state.value.context.value
          // The browser also unchecks the previously selected radio. Restore
          // every input owned by this API, including disabled and portalled ones.
          const root = input.getRootNode() as Document | ShadowRoot
          const owner = input.getAttribute('data-ownedby')
          for (const sibling of root.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
            if (sibling.getAttribute('data-ownedby') === owner)
              sibling.checked = sibling.value === value
          }
        })
      },
    }
  })
}
