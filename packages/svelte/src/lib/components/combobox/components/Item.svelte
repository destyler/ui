<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxItemBaseProps extends PolymorphicProps<'div'> {
    item: unknown
    persistFocus?: boolean
  }
  export interface ComboboxItemProps extends Assign<HTMLProps<'div'>, ComboboxItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'
  import { ComboboxItemProvider } from '../hooks/use-combobox-item-context'
  import { ComboboxItemPropsProvider } from '../hooks/use-combobox-item-props-context'

  const props: ComboboxItemProps = $props()

  const [itemProps, localProps] = $derived(
    createSplitProps<{ item: any; persistFocus?: boolean }>()(props, ['item', 'persistFocus']),
  )

  const combobox = useComboboxContext()
  const itemState = $derived(combobox().getItemState(itemProps))
  const mergedProps = $derived(mergeProps(combobox().getItemProps(itemProps), localProps))

  ComboboxItemProvider(() => itemState)
  ComboboxItemPropsProvider(() => itemProps)
</script>

<UI as="div" {...mergedProps} />
