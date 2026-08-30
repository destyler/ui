import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { CollectionItem, Optional } from '~/types'
import type { ListCollection } from '~/utils/collection'
import * as select from '@destyler/select'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createEffect, createMemo, createUniqueId, splitProps } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSelectProps<T extends CollectionItem>
  extends Optional<
    Omit<select.Context<T>, 'collection' | 'dir' | 'getRootNode' | 'open.controlled'>,
    'id'
  > {
  /**
   * The initial open state of the select when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: select.Context['open']
  /**
   * The initial value of the select when it is first rendered.
   * Use when you do not need to control the state of the select.
   */
  defaultValue?: select.Context<T>['value']
  /**
   * The collection of items
   */
  collection: ListCollection<T>
}

export interface UseSelectReturn<T extends CollectionItem>
  extends Accessor<select.Api<PropTypes, T>> {}

export function useSelect<T extends CollectionItem>(props: UseSelectProps<T>): UseSelectReturn<T> {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()
  const field = useFieldContext()

  const initialContext = createMemo(() => ({
    id,
    'ids': {
      label: field?.().ids.label,
      hiddenSelect: field?.().ids.control,
    },
    'disabled': field?.().disabled,
    'readOnly': field?.().readOnly,
    'invalid': field?.().invalid,
    'required': field?.().required,
    'dir': locale().dir,
    'getRootNode': environment().getRootNode,
    'open': props.defaultOpen,
    'value': props.defaultValue,
    'open.controlled': props.open !== undefined,
    ...props,
  }))

  const context = createMemo(() => {
    const [, restProps] = splitProps(initialContext(), ['collection'])
    return restProps
  })

  const [state, send, service] = useMachine(select.machine(initialContext()), {
    context,
  })

  createEffect(() => {
    service.setContext({ collection: props.collection })
  })

  return createMemo(() => select.connect<PropTypes, T>(state, send, normalizeProps))
}
