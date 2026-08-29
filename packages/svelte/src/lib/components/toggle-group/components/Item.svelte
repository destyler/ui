<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ItemProps } from '@destyler/toggle'

  export interface ToggleGroupItemBaseProps extends ItemProps, PolymorphicProps<'button'> {}
  export interface ToggleGroupItemProps extends Assign<HTMLProps<'button'>, ToggleGroupItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { UI } from '../../factory'
  import { useToggleGroupContext } from '../hooks/use-toggle-group-context'

  const props: ToggleGroupItemProps = $props()

  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['value', 'disabled']))

  const toggleGroup = useToggleGroupContext()
  const mergedProps = $derived(mergeProps(toggleGroup().getItemProps(itemProps), localProps))
  const resolvedProps = $derived({
    ...mergedProps,
    'aria-checked': mergedProps.role === 'radio' ? toggleGroup().getItemState(itemProps).pressed : undefined,
  })
</script>

<UI as="button" {...resolvedProps} />
