<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { PanelProps } from '@destyler/splitter'

  export interface SplitterPanelBaseProps extends PanelProps, PolymorphicProps<'div'> {}
  export interface SplitterPanelProps extends Assign<HTMLProps<'div'>, SplitterPanelBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSplitterContext } from '../hooks/use-splitter-context'

  const props: SplitterPanelProps = $props()

  const [splitterPanelProps, localProps] = $derived(createSplitProps<PanelProps>()(props, ['id', 'snapSize']))

  const splitter = useSplitterContext()
  const mergedProps = $derived(mergeProps(splitter().getPanelProps(splitterPanelProps), localProps))
</script>

<UI as="div" {...mergedProps} />
