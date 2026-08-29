<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface AspectRatioContentBaseProps extends PolymorphicProps<'div'> {}
  export interface AspectRatioContentProps extends Assign<HTMLProps<'div'>, AspectRatioContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useAspectRatioContext } from '../hooks/use-aspect-ratio-context'

  const props: AspectRatioContentProps = $props()
  const aspectRatio = useAspectRatioContext()
  const mergedProps = $derived(mergeProps(aspectRatio().getContentProps(), props))
</script>

<UI as="div" {...mergedProps} />
