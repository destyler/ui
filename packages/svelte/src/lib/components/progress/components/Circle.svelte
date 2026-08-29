<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ProgressCircleBaseProps extends PolymorphicProps<'svg'> {}
  export interface ProgressCircleProps extends Assign<HTMLProps<'svg'>, ProgressCircleBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useProgressContext } from '../hooks/use-progress-context'

  const props: ProgressCircleProps = $props()
  const progress = useProgressContext()
  const mergedProps = $derived(mergeProps(progress().getCircleProps(), props))
</script>

<UI as="svg" {...mergedProps} />
