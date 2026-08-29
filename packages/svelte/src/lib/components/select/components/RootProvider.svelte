<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { CollectionItem } from '../../collection'
  import type { UsePresenceProps } from '../../presence'
  import type { UseSelectReturn } from '../hooks/use-select.svelte'

  export interface SelectRootProviderBaseProps<T extends CollectionItem = CollectionItem>
    extends UsePresenceProps,
      PolymorphicProps<'div'> {
    value: UseSelectReturn<T>
  }

  export interface SelectRootProviderProps<T extends CollectionItem = CollectionItem>
    extends Assign<HTMLProps<'div'>, SelectRootProviderBaseProps<T>> {}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { SelectProvider } from '../hooks/use-select-context'

  const { value, ...props }: SelectRootProviderProps<T> = $props()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))
  const presence = usePresence(() => mergeProps({ present: value().open }, presenceProps))
  const mergedProps = $derived(mergeProps(value().getRootProps(), localProps))

  SelectProvider(() => value())
  PresenceProvider(presence)
</script>

<UI as="div" {...mergedProps} />
