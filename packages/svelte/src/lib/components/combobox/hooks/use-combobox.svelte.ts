import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import type { CollectionItem, ListCollection } from '../../collection'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as combobox from '@destyler/combobox'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseComboboxProps<T extends CollectionItem>
  extends Omit<combobox.Context<T>, 'dir' | 'getRootNode' | 'collection' | 'open.controlled' | 'id'> {
  id: string
  defaultOpen?: combobox.Context<T>['open']
  defaultValue?: combobox.Context<T>['value']
  /**
   * The collection of items
   */
  collection: MaybeFunction<ListCollection<T>>
}

export interface UseComboboxReturn<T extends CollectionItem> extends Accessor<combobox.Api<PropTypes, T>> {}

export function useCombobox<T extends CollectionItem>(props: MaybeFunction<UseComboboxProps<T>>): UseComboboxReturn<T> {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    const collection = runIfFn(resolvedProps.collection)
    return createMachineProps({
      ids: {
        label: field?.()?.ids.label,
        input: field?.()?.ids.control,
      },
      disabled: field?.()?.disabled,
      readOnly: field?.()?.readOnly,
      required: field?.()?.required,
      invalid: field?.()?.invalid,
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
      collection,
    }, { open: 'defaultOpen', value: 'defaultValue' }, ['open'])
  })

  const [state, send] = useMachine(() => combobox.machine(machineProps.initial as combobox.Context<T>), {
    get context() {
      return machineProps.context as combobox.Context<T>
    },
  })
  const api = $derived(combobox.connect<PropTypes, T>(state, send, normalizeProps))

  return () => api
}
