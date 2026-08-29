<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps, RefAttribute } from '$lib/types'
  import type { UsePresenceProps } from '../../presence'
  import type { UseNavigationMenuProps } from '../hooks/use-navigation-menu.svelte.js'

  export interface NavigationMenuRootBaseProps
    extends Optional<UseNavigationMenuProps, 'id'>, UsePresenceProps, PolymorphicProps<'nav'>, RefAttribute {}
  export interface NavigationMenuRootProps extends Assign<HTMLProps<'nav'>, NavigationMenuRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { NavigationMenuProvider } from '../hooks/use-navigation-menu-context'
  import { useNavigationMenu } from '../hooks/use-navigation-menu.svelte.js'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { createSplitProps } from '$lib/utils/create-split-props'

  let { ref = $bindable(null), value = $bindable(), ...props }: NavigationMenuRootProps = $props()

  const providedId = $props.id()
  const splitRootProps = createSplitProps<Optional<UseNavigationMenuProps, 'id'>>()

  const [presenceProps, navigationMenuProps] = $derived(splitPresenceProps(props))
  const [useNavigationMenuProps, localProps] = $derived(
    splitRootProps(navigationMenuProps, [
      'closeDelay',
      'defaultValue',
      'disableClickTrigger',
      'disableHoverTrigger',
      'disablePointerLeaveClose',
      'id',
      'ids',
      'onValueChange',
      'openDelay',
      'orientation',
      'value',
    ]),
  )

  const machineProps = $derived<UseNavigationMenuProps>({
    ...useNavigationMenuProps,
    id: useNavigationMenuProps.id ?? providedId,
    value,
    onValueChange(details) {
      useNavigationMenuProps.onValueChange?.(details)
      if (value !== undefined) value = details.value
    },
  })

  const navigationMenu = useNavigationMenu(() => machineProps)
  const presence = usePresence(() => mergeProps({ present: navigationMenu().open }, presenceProps))
  const mergedProps = $derived(mergeProps(navigationMenu().getRootProps(), localProps))

  PresenceProvider(() => presence())
  NavigationMenuProvider(() => navigationMenu())
</script>

<UI as="nav" bind:ref {...mergedProps} />
