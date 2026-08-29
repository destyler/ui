<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicControlBaseProps extends PolymorphicProps<'div'> {}
  export interface DynamicControlProps extends Assign<HTMLProps<'div'>, DynamicControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'

  const props: DynamicControlProps = $props()
  const dynamic = useDynamicContext()
  const mergedProps = $derived(mergeProps(dynamic().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />
