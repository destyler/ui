<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { CollectionItem } from '../../collection'

  export interface SelectItemBaseProps<T extends CollectionItem = CollectionItem> extends PolymorphicProps<'div'> {
    item: T
    disabled?: boolean
  }
  export interface SelectItemProps<T extends CollectionItem = CollectionItem>
    extends Assign<HTMLProps<'div'>, SelectItemBaseProps<T>> {}
</script>

<script lang="ts" generics="T extends CollectionItem = CollectionItem">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useSelectContext } from '../hooks/use-select-context'
  import { SelectItemProvider } from '../hooks/use-select-item-context'
  import { SelectItemPropsProvider } from '../hooks/use-select-item-props-context'

  const props: SelectItemProps<T> = $props()

  const select = useSelectContext()
  const itemProps = $derived({ item: props.item, disabled: props.disabled })
  const mergedProps = $derived(mergeProps(select().getItemProps(itemProps), props))

  SelectItemProvider(() => select().getItemState(itemProps))
  SelectItemPropsProvider(() => itemProps)
</script>

<UI as="div" {...mergedProps} />
