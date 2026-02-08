import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import type { CollectionItem, ListCollection } from '~/utils/collection'
import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/react'
import { useEffect, useId } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseComboboxProps<T extends CollectionItem>
  extends Optional<Omit<combobox.Context<T>, 'dir' | 'getRootNode' | 'collection' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the combobox when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: combobox.Context['open']
  /**
   * The initial value of the combobox when it is first rendered.
   * Use when you do not need to control the state of the combobox.
   */
  defaultValue?: combobox.Context<T>['value']
  /**
   * The collection of items
   */
  collection: ListCollection<T>
}

export interface UseComboboxReturn<T extends CollectionItem> extends combobox.Api<PropTypes, T> {}

export function useCombobox<T extends CollectionItem>(props: UseComboboxProps<T>): UseComboboxReturn<T> {
  const { collection, ...comboboxProps } = props

  const { dir } = useLocaleContext()
  const { getRootNode } = useEnvironmentContext()
  const field = useFieldContext()

  const initialContext: combobox.Context<T> = {
    'id': useId(),
    'ids': {
      label: field?.ids.label,
      input: field?.ids.control,
    },
    'disabled': field?.disabled,
    'readOnly': field?.readOnly,
    'required': field?.required,
    'invalid': field?.invalid,
    dir,
    getRootNode,
    collection,
    'open': props.defaultOpen,
    'value': props.defaultValue,
    'open.controlled': props.open !== undefined,
    ...comboboxProps,
  }

  const context = (() => {
    const { collection: _, ...restProps } = initialContext
    return {
      ...restProps,
      value: props.value,
      onValueChange: useEvent(props.onValueChange),
      onInputValueChange: useEvent(props.onInputValueChange, { sync: true }),
      onHighlightChange: useEvent(props.onHighlightChange),
      onOpenChange: useEvent(props.onOpenChange),
    }
  })()

  const [state, send, service] = useMachine(combobox.machine(initialContext), {
    context,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    service.setContext({ collection })
  }, [collection])

  return combobox.connect(state, send, normalizeProps)
}
