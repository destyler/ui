<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface NavigationMenuViewportBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface NavigationMenuViewportProps extends Assign<HTMLProps<'div'>, NavigationMenuViewportBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

  let { ref = $bindable(null), ...props }: NavigationMenuViewportProps = $props()
  const navigationMenu = useNavigationMenuContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(
    mergeProps(navigationMenu().getViewportProps(), presence().getPresenceProps(), props),
  )
  const setNode = (node: Element | null) => untrack(() => presence().setNode(node))
</script>

{#if !presence().unmounted}
  <UI as="div" bind:ref {...mergedProps} {@attach setNode} />
{/if}
