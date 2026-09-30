<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { CollectionItem } from '../../collection'
  import type { UsePresenceProps } from '../../presence'
  import type { UseSelectProps } from '../hooks/use-select.svelte'

  export interface SelectRootBaseProps<T extends CollectionItem = CollectionItem>
    extends Optional<UseSelectProps<T>, 'id'>,
      UsePresenceProps,
      PolymorphicProps<'div'> {}

  export interface SelectRootProps<T extends CollectionItem = CollectionItem>
    extends Assign<HTMLProps<'div'>, SelectRootBaseProps<T>> {}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { SelectProvider } from '../hooks/use-select-context'
  import { useSelect } from '../hooks/use-select.svelte'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    value = $bindable<string[] | undefined>(),
    value: valueProp,
    open = $bindable<boolean | undefined>(),
    open: openProp,
    ...props
  }: SelectRootProps<T> = $props()

  const providedId = $props.id()
  const [presenceProps, selectProps] = $derived(splitPresenceProps(props))
  const [useSelectProps, localProps] = $derived(
    createSplitProps<Optional<UseSelectProps<T>, 'id'>>()(selectProps, [
      'closeOnSelect',
      'collection',
      'composite',
      'defaultOpen',
      'defaultValue',
      'deselectable',
      'disabled',
      'form',
      'highlightedValue',
      'id',
      'ids',
      'invalid',
      'loopFocus',
      'multiple',
      'name',
      'onFocusOutside',
      'onHighlightChange',
      'onInteractOutside',
      'onOpenChange',
      'onPointerDownOutside',
      'onValueChange',
      'open',
      'positioning',
      'readOnly',
      'required',
      'scrollToIndexFn',
      'value',
    ]),
  )
  const machineProps = $derived.by<UseSelectProps<T>>(() => ({
    ...useSelectProps,
    id: useSelectProps.id ?? providedId,
    value: valueProp,
    onValueChange(details) {
      value = details.value
      useSelectProps.onValueChange?.(details)
    },
    open: openProp,
    onOpenChange(details) {
      useSelectProps.onOpenChange?.(details)
      open = details.open
    },
  }))

  const select = useSelect(() => machineProps)
  const presence = usePresence(() => mergeProps({ present: select().open }, presenceProps))
  const mergedProps = $derived(mergeProps(select().getRootProps(), localProps))

  SelectProvider(select)
  PresenceProvider(presence)
</script>

<UI as="div" {...mergedProps} />
