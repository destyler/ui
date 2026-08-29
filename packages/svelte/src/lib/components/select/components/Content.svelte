<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface SelectContentBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface SelectContentProps extends Assign<HTMLProps<'div'>, SelectContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { usePresenceContext } from '../../presence'
  import { useSelectContext } from '../hooks/use-select-context'

  const props: SelectContentProps = $props()
  const select = useSelectContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(select().getContentProps(), presence().getPresenceProps(), props))
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} />
{/if}
