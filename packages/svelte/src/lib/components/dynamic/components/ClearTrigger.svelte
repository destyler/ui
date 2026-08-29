<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicClearTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface DynamicClearTriggerProps extends Assign<HTMLProps<'button'>, DynamicClearTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'

  const props: DynamicClearTriggerProps = $props()
  const dynamic = useDynamicContext()
  const mergedProps = $derived(mergeProps(dynamic().getClearTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
