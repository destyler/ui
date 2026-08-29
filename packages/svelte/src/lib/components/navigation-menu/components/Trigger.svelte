<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'
  import type { TriggerProps } from '@destyler/navigation-menu'

  export interface NavigationMenuTriggerBaseProps
    extends Omit<TriggerProps, 'value'>, PolymorphicProps<'button'>, RefAttribute {}
  export interface NavigationMenuTriggerProps extends Assign<HTMLProps<'button'>, NavigationMenuTriggerBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
  import { useNavigationMenuItemPropsContext } from '../hooks/use-navigation-menu-item-props-context'

  let { ref = $bindable(null), ...props }: NavigationMenuTriggerProps = $props()
  const splitTriggerProps = createSplitProps<TriggerProps>()

  const itemContext = useNavigationMenuItemPropsContext()
  const value = $derived(itemContext!().value)
  const disabled = $derived(props.disabled)

  const combinedProps = $derived({ ...props, value, disabled })
  const [triggerProps, localProps] = $derived(splitTriggerProps(combinedProps, ['value', 'disabled']))

  const navigationMenu = useNavigationMenuContext()
  const mergedProps = $derived(mergeProps(navigationMenu().getTriggerProps(triggerProps), localProps))
</script>

<UI as="button" bind:ref {...mergedProps} />
