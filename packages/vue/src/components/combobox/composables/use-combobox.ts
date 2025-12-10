import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from './combobox'
import type { EmitFn, Optional } from '~/types'
import type { CollectionItem } from '~/utils'
import * as combobox from '@destyler/combobox'
import { omit } from '@destyler/utils'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId, watch } from 'vue'
import { useFieldContext } from '~/components/field'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseComboboxProps<T extends CollectionItem>
  extends Optional<Omit<combobox.Context<T>, 'dir' | 'getRootNode' | 'open.controlled' | 'value'>, 'id'> {
  modelValue?: combobox.Context<T>['value']
  /**
   * The initial open state of the combobox when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: combobox.Context['open']
  /**
   * The initial value of the combobox when it is first rendered.
   * Use when you do not need to control the state of the combobox.
   */
  defaultValue?: combobox.Context['value']
}

export interface UseComboboxReturn<T extends CollectionItem> extends ComputedRef<combobox.Api<PropTypes, T>> {}

export function useCombobox<T extends CollectionItem>(props: UseComboboxProps<T>, emit?: EmitFn<RootEmits<T>>): UseComboboxReturn<T> {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const field = useFieldContext()

  const context = computed<combobox.Context<T>>(() => {
    return {
      id,
      'ids': {
        label: field?.value.ids.label,
        input: field?.value.ids.control,
      },
      'disabled': field?.value.disabled,
      'readOnly': field?.value.readOnly,
      'required': field?.value.required,
      'invalid': field?.value.invalid,
      'dir': locale.value.dir,
      'open': props.defaultOpen,
      'open.controlled': props.open !== undefined,
      'value': props.modelValue ?? props.defaultValue,
      'getRootNode': env?.value.getRootNode,
      'onFocusOutside': details => emit?.('focusOutside', details),
      'onHighlightChange': details => emit?.('highlightChange', details),
      'onInputValueChange': details => emit?.('inputValueChange', details),
      'onInteractOutside': details => emit?.('interactOutside', details),
      'onPointerDownOutside': details => emit?.('pointerDownOutside', details),
      'onOpenChange': (details) => {
        emit?.('openChange', details)
        emit?.('update:open', details.open)
      },
      'onValueChange': (details) => {
        emit?.('valueChange', details)
        emit?.('update:modelValue', details.value)
      },
      ...cleanProps(props),
    }
  })

  const [state, send, service] = useMachine(combobox.machine(context.value), {
    context: computed(() => omit(context.value, ['collection'])),
  })

  watch(
    () => props.collection,
    (collection) => {
      service.setContext({ collection })
    },
  )

  return computed(() => combobox.connect(state.value, send, normalizeProps))
}
