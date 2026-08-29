<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'
  import type { ItemProps } from '@destyler/navigation-menu'

  export interface NavigationMenuItemBaseProps extends ItemProps, PolymorphicProps<'div'>, RefAttribute {}
  export interface NavigationMenuItemProps extends Assign<HTMLProps<'div'>, NavigationMenuItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
  import { NavigationMenuItemPropsProvider } from '../hooks/use-navigation-menu-item-props-context'
  import { createSplitProps } from '$lib/utils/create-split-props'

  let { ref = $bindable(null), ...props }: NavigationMenuItemProps = $props()
  const splitItemProps = createSplitProps<ItemProps>()
  const [itemProps, localProps] = $derived(splitItemProps(props, ['value']))

  const navigationMenu = useNavigationMenuContext()
  const mergedProps = $derived(mergeProps(navigationMenu().getItemProps(itemProps), localProps))

  NavigationMenuItemPropsProvider(() => itemProps)
</script>

<UI as="div" bind:ref {...mergedProps} />
