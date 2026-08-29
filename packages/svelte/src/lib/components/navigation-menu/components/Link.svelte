<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'
  import type { LinkProps } from '@destyler/navigation-menu'

  export interface NavigationMenuLinkBaseProps extends Partial<LinkProps>, PolymorphicProps<'a'>, RefAttribute {}
  export interface NavigationMenuLinkProps extends Assign<HTMLProps<'a'>, NavigationMenuLinkBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
  import { useNavigationMenuItemPropsContext } from '../hooks/use-navigation-menu-item-props-context'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import type { RequiredBy } from '@destyler/types'

  let { ref = $bindable(null), ...props }: NavigationMenuLinkProps = $props()

  const itemContext = useNavigationMenuItemPropsContext()
  const value = $derived(props.value ?? itemContext?.()?.value)
  const combinedProps = $derived(mergeProps(props, { value }) as RequiredBy<NavigationMenuLinkProps, 'value'>)

  const splitLinkProps = createSplitProps<LinkProps>()
  const [linkProps, localProps] = $derived(
    splitLinkProps(combinedProps, ['active', 'onSelect', 'value']),
  )

  const navigationMenu = useNavigationMenuContext()
  const mergedProps = $derived(mergeProps(navigationMenu().getLinkProps(linkProps), localProps))
</script>

<UI as="a" bind:ref {...mergedProps} />
