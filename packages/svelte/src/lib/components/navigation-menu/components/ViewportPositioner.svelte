<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface NavigationMenuViewportPositionerBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface NavigationMenuViewportPositionerProps
    extends Assign<HTMLProps<'div'>, NavigationMenuViewportPositionerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

  let { ref = $bindable(null), ...props }: NavigationMenuViewportPositionerProps = $props()
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = $derived(mergeProps(navigationMenu().getViewportPositionerProps(), props))
</script>

<UI as="div" bind:ref {...mergedProps} />
