<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface DynamicLabelProps extends Assign<HTMLProps<'label'>, DynamicLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'

  const props: DynamicLabelProps = $props()
  const dynamic = useDynamicContext()
  const mergedProps = $derived(mergeProps(dynamic().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />
