<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ProgressRangeBaseProps extends PolymorphicProps<'div'> {}
  export interface ProgressRangeProps extends Assign<HTMLProps<'div'>, ProgressRangeBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useProgressContext } from '../hooks/use-progress-context'

  const props: ProgressRangeProps = $props()
  const progress = useProgressContext()
  const mergedProps = $derived(mergeProps(progress().getRangeProps(), props))
</script>

<UI as="div" {...mergedProps} />
