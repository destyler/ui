<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'
  import type { UsePresenceProps } from '../../presence'
  import type { UseNavigationMenuReturn } from '../hooks/use-navigation-menu.svelte.js'

  interface RootProviderProps {
    value: UseNavigationMenuReturn
  }

  export interface NavigationMenuRootProviderBaseProps
    extends RootProviderProps, PolymorphicProps<'nav'>, UsePresenceProps, RefAttribute {}

  export interface NavigationMenuRootProviderProps extends Assign<
    HTMLProps<'nav'>,
    NavigationMenuRootProviderBaseProps
  > {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { NavigationMenuProvider } from '../hooks/use-navigation-menu-context'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'

  let { ref = $bindable(null), value, ...props }: NavigationMenuRootProviderProps = $props()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))

  const presence = usePresence(() => mergeProps({ present: value().open }, presenceProps))
  const mergedProps = $derived(mergeProps(value().getRootProps(), localProps))

  NavigationMenuProvider(() => value())
  PresenceProvider(() => presence())
</script>

<UI as="nav" bind:ref {...mergedProps} />
