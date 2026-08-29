<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ResizeTriggerProps } from '@destyler/splitter'

  export interface SplitterResizeTriggerBaseProps extends ResizeTriggerProps, PolymorphicProps<'button'> {}
  export interface SplitterResizeTriggerProps extends Assign<HTMLProps<'button'>, SplitterResizeTriggerBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSplitterContext } from '../hooks/use-splitter-context'

  const props: SplitterResizeTriggerProps = $props()

  const [triggerProps, localProps] = $derived(createSplitProps<ResizeTriggerProps>()(props, ['disabled', 'id', 'step']))

  const splitter = useSplitterContext()
  const mergedProps = $derived(mergeProps(splitter().getResizeTriggerProps(triggerProps), localProps))
</script>

<UI as="button" {...mergedProps} />
