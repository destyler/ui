import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { EmitFn, Optional } from '~/types'
import * as switches from '@destyler/switch'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseSwitchProps extends Optional<Omit<switches.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The checked state of the switch when it is first rendered.
   * Use this when you do not need to control the state of the switch.
   */
  defaultChecked?: switches.Context['checked']
}

export interface UseSwitchReturn extends ComputedRef<switches.Api<PropTypes>> {}

export function useSwitch(props: UseSwitchProps = {}, emit?: EmitFn<RootEmits>): UseSwitchReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()

  const context = computed<switches.Context>(() => ({
    id,
    ids: {
      label: field?.value.ids.label,
      hiddenInput: field?.value.ids.control,
    },
    disabled: field?.value.disabled,
    readOnly: field?.value.readOnly,
    invalid: field?.value.invalid,
    required: field?.value.required,
    dir: locale.value.dir,
    checked: props.defaultChecked,
    getRootNode: env?.value.getRootNode,
    onCheckedChange(details) {
      emit?.('checkedChange', details)
      emit?.('update:checked', details.checked)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(switches.machine(context.value), { context })

  return computed(() => switches.connect(state.value, send, normalizeProps))
}
