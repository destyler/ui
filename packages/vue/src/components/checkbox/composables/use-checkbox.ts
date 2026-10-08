import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as checkbox from '@destyler/checkbox'
import { mergeProps, normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'
import { reconcileNativeInput } from '~/utils/reconcile-native-input'
import { useCheckboxGroupContext } from './use-checkbox-group-context'

export interface UseCheckboxProps extends Optional<Omit<checkbox.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The checked state of the checkbox when it is first rendered.
   * Use this when you do not need to control the state of the checkbox.
   */
  defaultChecked?: checkbox.Context['checked']
}

export interface UseCheckboxReturn extends ComputedRef<checkbox.Api<PropTypes>> {}

export function useCheckbox(ownProps: UseCheckboxProps = {}, emit?: EmitFn<RootEmits>): UseCheckboxReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()

  const checkboxGroup = useCheckboxGroupContext()
  const props = computed(() => {
    return mergeProps(ownProps, checkboxGroup?.value.getItemProps({ value: ownProps.value }) ?? {})
  })

  const context = computed<checkbox.Context>(() => ({
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
    getRootNode: env?.value.getRootNode,
    ...cleanProps(props.value),
    onCheckedChange(details) {
      props.value.onCheckedChange?.(details)
      emit?.('checkedChange', details)
      emit?.('update:checked', details.checked)
    },
  }))

  const [state, send] = useMachine(checkbox.machine(context.value), { context })

  return computed(() => {
    const api = checkbox.connect(state.value, send, normalizeProps)
    return {
      ...api,
      getHiddenInputProps() {
        return reconcileNativeInput({ ...api.getHiddenInputProps(), indeterminate: api.indeterminate }, (input) => {
          // Core retains its initial ownership when a live prop becomes
          // undefined. Reconcile against the current accepted machine value.
          const checked = state.value.context.checked
          input.checked = checked === true
          input.indeterminate = checked === 'indeterminate'
        })
      },
    }
  })
}
