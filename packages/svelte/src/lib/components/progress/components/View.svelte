<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ViewProps } from '@destyler/progress'

  export interface ProgressViewBaseProps extends ViewProps, PolymorphicProps<'span'> {}
  export interface ProgressViewProps extends Assign<HTMLProps<'span'>, ProgressViewBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useProgressContext } from '../hooks/use-progress-context'

  const props: ProgressViewProps = $props()
  const progress = useProgressContext()
  const mergedProps = $derived(mergeProps(progress().getViewProps(props), props))
</script>

<UI as="span" {...mergedProps} />
