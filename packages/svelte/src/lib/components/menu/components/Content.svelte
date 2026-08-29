<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface MenuContentBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface MenuContentProps extends Assign<HTMLProps<'div'>, MenuContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'

  let { ref = $bindable<Element | null>(), ...props }: MenuContentProps = $props()

  const menu = useRequiredMenuContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(menu().getContentProps(), presence().getPresenceProps(), props))

  function setNode(node: HTMLElement | null) {
    untrack(() => presence().setNode(node))
    ref = node
  }
</script>

{#if !presence().unmounted}
  <UI as="div" {@attach setNode} {...mergedProps} />
{/if}
