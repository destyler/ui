<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ProgressTrackBaseProps extends PolymorphicProps<'div'> {}
  export interface ProgressTrackProps extends Assign<HTMLProps<'div'>, ProgressTrackBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useProgressContext } from '../hooks/use-progress-context'

  const props: ProgressTrackProps = $props()
  const progress = useProgressContext()
  const mergedProps = $derived(mergeProps(progress().getTrackProps(), props))
</script>

<UI as="div" {...mergedProps} />
