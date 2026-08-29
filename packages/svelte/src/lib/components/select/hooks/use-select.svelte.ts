import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import type { CollectionItem, ListCollection } from '../../collection'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext, useLocaleContext } from '$lib/providers'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as select from '@destyler/select'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseSelectProps<T extends CollectionItem>
  extends Omit<select.Context<T>, 'dir' | 'getRootNode' | 'collection' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: select.Context<T>['open']
  defaultValue?: select.Context<T>['value']
  /**
   * The collection of items
   */
  collection: MaybeFunction<ListCollection<T>>
}

export interface UseSelectReturn<T extends CollectionItem> extends Accessor<select.Api<PropTypes, T>> {}

export function useSelect<T extends CollectionItem>(props: MaybeFunction<UseSelectProps<T>>): UseSelectReturn<T> {
  const locale = useLocaleContext()
  const env = useEnvironmentContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    const collection = runIfFn(resolvedProps.collection)
    return createMachineProps({
      ids: {
        label: field?.().ids?.label,
        hiddenSelect: field?.().ids?.control,
      },
      disabled: field?.().disabled,
      readOnly: field?.().readOnly,
      invalid: field?.().invalid,
      required: field?.().required,
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
      collection,
    }, { open: 'defaultOpen', value: 'defaultValue' }, ['open'])
  })

  const [state, send] = useMachine(() => select.machine(machineProps.initial as select.Context<T>), {
    get context() {
      return machineProps.context as select.Context<T>
    },
  })

  const api = $derived(select.connect<PropTypes, T>(state, send, normalizeProps))
  return () => api
}
