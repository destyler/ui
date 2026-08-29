<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types.js'

  export interface CalendarContentBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface CalendarContentProps extends Assign<HTMLProps<'div'>, CalendarContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory/index.js'
  import { useCalendarContext } from '../hooks/use-calendar-context.js'
  import { usePresenceContext } from '../../presence/index.js'

  let { ref, ...props }: CalendarContentProps = $props()

  const calendar = useCalendarContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(calendar().getContentProps(), presence().getPresenceProps(), props))

  function setNode(node: HTMLElement) {
    untrack(() => presence().setNode(node))
    ref = node
  }
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} {@attach setNode} />
{/if}
