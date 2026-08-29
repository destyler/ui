<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'
  import type { ContentProps } from '@destyler/navigation-menu'

  export interface NavigationMenuContentBaseProps
    extends Partial<ContentProps>, PolymorphicProps<'div'>, RefAttribute {}
  export interface NavigationMenuContentProps extends Assign<HTMLProps<'div'>, NavigationMenuContentBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
  import { useNavigationMenuItemPropsContext } from '../hooks/use-navigation-menu-item-props-context'

  let { ref = $bindable(null), ...props }: NavigationMenuContentProps = $props()

  const navigationMenu = useNavigationMenuContext()
  const itemContext = useNavigationMenuItemPropsContext()
  const presence = usePresenceContext()
  const value = $derived.by(() => {
    const resolvedValue = props.value ?? itemContext?.().value
    if (resolvedValue !== undefined)
      return resolvedValue

    const error = new Error('NavigationMenu.Content requires a value prop or a parent NavigationMenu.Item')
    error.name = 'ContextError'
    throw error
  })
  const [contentProps, localProps] = $derived(
    createSplitProps<ContentProps>()({ ...props, value }, ['value']),
  )
  const mergedProps = $derived(
    mergeProps(presence().getPresenceProps(), navigationMenu().getContentProps(contentProps), localProps),
  )

  const setNode = (node: Element | null) => untrack(() => presence().setNode(node))
</script>

{#if !presence().unmounted}
  <UI as="div" bind:ref {...mergedProps} {@attach setNode} />
{/if}
