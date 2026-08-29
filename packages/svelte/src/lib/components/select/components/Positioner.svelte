<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectPositionerBaseProps extends PolymorphicProps<'div'> {}
  export interface SelectPositionerProps extends Assign<HTMLProps<'div'>, SelectPositionerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { usePresenceContext } from '../../presence'
  import { useSelectContext } from '../hooks/use-select-context'

  const props: SelectPositionerProps = $props()
  const select = useSelectContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(select().getPositionerProps(), props))
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} />
{/if}
