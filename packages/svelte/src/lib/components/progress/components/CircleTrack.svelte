<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ProgressCircleTrackBaseProps extends PolymorphicProps<'circle'> {}
  export interface ProgressCircleTrackProps extends Assign<HTMLProps<'circle'>, ProgressCircleTrackBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useProgressContext } from '../hooks/use-progress-context'

  const props: ProgressCircleTrackProps = $props()
  const progress = useProgressContext()
  const mergedProps = $derived(mergeProps(progress().getCircleTrackProps(), props))
</script>

<UI as="circle" {...mergedProps} />
