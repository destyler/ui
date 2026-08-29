<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ItemGroupProps } from '@destyler/combobox'

  export interface ComboboxItemGroupBaseProps extends Partial<ItemGroupProps>, PolymorphicProps<'div'> {}
  export interface ComboboxItemGroupProps extends Assign<HTMLProps<'div'>, ComboboxItemGroupBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'
  import { ComboboxItemGroupPropsProvider } from '../hooks/use-combobox-item-group-props-context'

  const props: ComboboxItemGroupProps = $props()
  const providedId = $props.id()

  const [itemGroupProps, localProps] = $derived(createSplitProps<Partial<ItemGroupProps>>()(props, ['id']))

  const groupProps = $derived({ ...itemGroupProps, id: itemGroupProps.id ?? providedId })

  const combobox = useComboboxContext()
  const mergedProps = $derived(mergeProps(combobox().getItemGroupProps(groupProps), localProps))

  ComboboxItemGroupPropsProvider(() => groupProps)
</script>

<UI as="div" {...mergedProps} />
