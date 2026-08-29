<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  import type { ItemProps } from '@destyler/menu'

  export interface MenuItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
  export interface MenuItemProps extends Assign<HTMLProps<'div'>, MenuItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { MenuItemProvider } from '../hooks/use-menu-item-context'
  import { createSplitProps } from '$lib/utils/create-split-props'

  const props: MenuItemProps = $props()

  const [itemProps, localProps] = $derived(
    createSplitProps<ItemProps>()(props, ['closeOnSelect', 'disabled', 'value', 'valueText']),
  )

  const menu = useRequiredMenuContext()
  const mergedProps = $derived(mergeProps(menu().getItemProps(itemProps), localProps))
  const itemState = $derived(menu().getItemState(itemProps))

  MenuItemProvider(() => itemState)
</script>

<UI as="div" {...mergedProps} />
