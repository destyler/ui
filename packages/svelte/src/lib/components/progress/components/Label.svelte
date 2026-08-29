<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ProgressLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface ProgressLabelProps extends Assign<HTMLProps<'label'>, ProgressLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useProgressContext } from '../hooks/use-progress-context'

  const props: ProgressLabelProps = $props()
  const progress = useProgressContext()
  const mergedProps = $derived(mergeProps(progress().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />
