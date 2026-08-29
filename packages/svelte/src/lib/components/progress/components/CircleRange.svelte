<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ProgressCircleRangeBaseProps extends PolymorphicProps<'circle'> {}
  export interface ProgressCircleRangeProps extends Assign<HTMLProps<'circle'>, ProgressCircleRangeBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useProgressContext } from '../hooks/use-progress-context'

  const props: ProgressCircleRangeProps = $props()
  const progress = useProgressContext()
  const mergedProps = $derived(mergeProps(progress().getCircleRangeProps(), props))
</script>

<UI as="circle" {...mergedProps} />
