import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseDynamicProps extends Optional<Omit<dynamic.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial value of the dynamic when it is first rendered.
   * Use when you do not need to control the state of the dynamic.
   */
  defaultValue?: dynamic.Context['value']
  modelValue?: dynamic.Context['value']
}
export interface UseDynamicReturn extends ComputedRef<dynamic.Api<PropTypes>> {}

export function useDynamic(props: UseDynamicProps = {}, emit?: EmitFn<RootEmits>): UseDynamicReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()

  const context = computed<dynamic.Context>(() => ({
    id,
    ids: {
      label: field?.value.ids.label,
      hiddenInput: field?.value.ids.control,
    },
    disabled: field?.value.disabled,
    invalid: field?.value.invalid,
    readOnly: field?.value.readOnly,
    required: field?.value.required,
    dir: locale.value.dir,
    value: props.modelValue ?? props.defaultValue,
    getRootNode: env?.value.getRootNode,
    onValueChange(details) {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    onFocusOutside: details => emit?.('focusOutside', details),
    onHighlightChange: details => emit?.('highlightChange', details),
    onInputValueChange: details => emit?.('inputValueChange', details),
    onInteractOutside: details => emit?.('interactOutside', details),
    onPointerDownOutside: details => emit?.('pointerDownOutside', details),
    onValueInvalid: details => emit?.('valueInvalid', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(dynamic.machine(context.value), { context })

  return computed(() => dynamic.connect(state.value, send, normalizeProps))
}
